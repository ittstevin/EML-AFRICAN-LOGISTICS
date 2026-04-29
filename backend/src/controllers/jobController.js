const { PrismaClient } = require('@prisma/client');
const pricingService = require('../services/pricingService');
const auditService = require('../services/auditService');

const prisma = new PrismaClient();

// Valid status transitions
const VALID_TRANSITIONS = {
  'Pending': ['Approved'],
  'Approved': ['Loaded'],
  'Loaded': ['InTransit'],
  'InTransit': ['Delivered'],
  'Delivered': ['Completed']
};

/**
 * Get all jobs
 */
const getJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, truckId, userId } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (truckId) where.truckId = truckId;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          truck: {
            select: {
              id: true,
              plateNumber: true,
              type: true,
              status: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get job by ID
 */
const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true,
            status: true,
            owner: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        invoice: true
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new job
 */
const createJob = async (req, res, next) => {
  try {
    const jobData = req.body;

    // If truckId provided, check if truck is available
    if (jobData.truckId) {
      const truck = await prisma.truck.findUnique({
        where: { id: jobData.truckId }
      });

      if (!truck) {
        return res.status(404).json({
          success: false,
          message: 'Truck not found'
        });
      }

      if (truck.status !== 'Available') {
        return res.status(400).json({
          success: false,
          message: 'Truck is not available for assignment'
        });
      }
    }

    // Calculate price
    const priceCalculation = pricingService.calculatePrice({
      distance: jobData.distance,
      estimatedTime: jobData.estimatedTime,
      goodsType: jobData.goodsType,
      truckType: jobData.truckId ? (await prisma.truck.findUnique({
        where: { id: jobData.truckId },
        select: { type: true }
      })).type : 'medium' // default if no truck assigned yet
    });

    const job = await prisma.job.create({
      data: {
        ...jobData,
        price: priceCalculation.total
      },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        }
      }
    });

    // Log creation
    await auditService.logAction(req.user.id, 'JOB_CREATED', {
      jobId: job.id,
      goodsType: job.goodsType,
      price: job.price
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: {
        ...job,
        priceBreakdown: priceCalculation.breakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update job
 */
const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingJob = await prisma.job.findUnique({
      where: { id }
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // If changing truck, validate availability
    if (updateData.truckId && updateData.truckId !== existingJob.truckId) {
      const truck = await prisma.truck.findUnique({
        where: { id: updateData.truckId }
      });

      if (!truck) {
        return res.status(404).json({
          success: false,
          message: 'New truck not found'
        });
      }

      if (truck.status !== 'Available') {
        return res.status(400).json({
          success: false,
          message: 'New truck is not available'
        });
      }
    }

    // If status change, validate transition
    if (updateData.status && updateData.status !== existingJob.status) {
      if (!VALID_TRANSITIONS[existingJob.status]?.includes(updateData.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition from ${existingJob.status} to ${updateData.status}`
        });
      }
    }

    const job = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        }
      }
    });

    // Log update
    await auditService.logAction(req.user.id, 'JOB_UPDATED', {
      jobId: job.id,
      changes: updateData
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve job (Admin/Operator only)
 */
const approveJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: { truck: true }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Job is not in pending status'
      });
    }

    if (!job.truckId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot approve job without assigned truck'
      });
    }

    // Update job status and lock price
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: 'Approved'
      },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        }
      }
    });

    // Update truck status to InTransit
    await prisma.truck.update({
      where: { id: job.truckId },
      data: { status: 'InTransit' }
    });

    // Log approval
    await auditService.logAction(req.user.id, 'JOB_APPROVED', {
      jobId: updatedJob.id,
      truckId: updatedJob.truckId
    });

    res.json({
      success: true,
      message: 'Job approved successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark job as loaded
 */
const loadJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: { truck: true }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Job must be approved before loading'
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: 'Loaded'
      },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        }
      }
    });

    // Log loading
    await auditService.logAction(req.user.id, 'JOB_LOADED', {
      jobId: updatedJob.id
    });

    res.json({
      success: true,
      message: 'Job marked as loaded',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm delivery
 */
const confirmDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body; // Simple OTP simulation

    const job = await prisma.job.findUnique({
      where: { id },
      include: { truck: true }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'InTransit') {
      return res.status(400).json({
        success: false,
        message: 'Job must be in transit to confirm delivery'
      });
    }

    // Simple confirmation (in production, use proper OTP)
    if (confirmationCode !== 'DELIVERED') {
      return res.status(400).json({
        success: false,
        message: 'Invalid confirmation code'
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: 'Delivered'
      },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        }
      }
    });

    // Update truck status back to Available
    await prisma.truck.update({
      where: { id: job.truckId },
      data: { status: 'Available' }
    });

    // Log delivery
    await auditService.logAction(req.user.id, 'JOB_DELIVERED', {
      jobId: updatedJob.id
    });

    res.json({
      success: true,
      message: 'Delivery confirmed successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete job (generate invoice)
 */
const completeJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: { invoice: true }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Job must be delivered before completion'
      });
    }

    if (job.invoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this job'
      });
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        jobId: id,
        totalAmount: job.price
      }
    });

    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        status: 'Completed'
      },
      include: {
        truck: {
          select: {
            id: true,
            plateNumber: true,
            type: true
          }
        },
        invoice: true
      }
    });

    // Log completion
    await auditService.logAction(req.user.id, 'JOB_COMPLETED', {
      jobId: updatedJob.id,
      invoiceId: invoice.id
    });

    res.json({
      success: true,
      message: 'Job completed and invoice generated',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  approveJob,
  loadJob,
  confirmDelivery,
  completeJob
};