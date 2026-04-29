const { PrismaClient } = require('@prisma/client');
const auditService = require('../services/auditService');

const prisma = new PrismaClient();

/**
 * Get all trucks
 */
const getTrucks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, ownerId } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (ownerId) where.ownerId = ownerId;

    const [trucks, total] = await Promise.all([
      prisma.truck.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              contact: true
            }
          },
          _count: {
            select: { jobs: true }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.truck.count({ where })
    ]);

    res.json({
      success: true,
      data: trucks,
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
 * Get truck by ID
 */
const getTruckById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const truck = await prisma.truck.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            contact: true
          }
        },
        jobs: {
          select: {
            id: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Truck not found'
      });
    }

    res.json({
      success: true,
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new truck
 */
const createTruck = async (req, res, next) => {
  try {
    const truckData = req.body;

    const truck = await prisma.truck.create({
      data: truckData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            contact: true
          }
        }
      }
    });

    // Log creation
    await auditService.logAction(req.user.id, 'TRUCK_CREATED', {
      truckId: truck.id,
      plateNumber: truck.plateNumber
    });

    res.status(201).json({
      success: true,
      message: 'Truck created successfully',
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update truck
 */
const updateTruck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const truck = await prisma.truck.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            contact: true
          }
        }
      }
    });

    // Log update
    await auditService.logAction(req.user.id, 'TRUCK_UPDATED', {
      truckId: truck.id,
      changes: updateData
    });

    res.json({
      success: true,
      message: 'Truck updated successfully',
      data: truck
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete truck
 */
const deleteTruck = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if truck has active jobs
    const activeJobs = await prisma.job.count({
      where: {
        truckId: id,
        status: {
          in: ['Pending', 'Approved', 'Loaded', 'InTransit']
        }
      }
    });

    if (activeJobs > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete truck with active jobs'
      });
    }

    const truck = await prisma.truck.delete({
      where: { id }
    });

    // Log deletion
    await auditService.logAction(req.user.id, 'TRUCK_DELETED', {
      truckId: id,
      plateNumber: truck.plateNumber
    });

    res.json({
      success: true,
      message: 'Truck deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck
};