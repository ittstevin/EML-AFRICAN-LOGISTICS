const { PrismaClient } = require('@prisma/client');
const auditService = require('../services/auditService');

const prisma = new PrismaClient();

/**
 * Get all invoices
 */
const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (jobId) where.jobId = jobId;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              goodsType: true,
              pickupLocation: true,
              deliveryLocation: true,
              status: true
            }
          },
          payments: {
            select: {
              id: true,
              amount: true,
              method: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.invoice.count({ where })
    ]);

    res.json({
      success: true,
      data: invoices,
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
 * Get invoice by ID
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            goodsType: true,
            weight: true,
            pickupLocation: true,
            deliveryLocation: true,
            distance: true,
            status: true,
            truck: {
              select: {
                id: true,
                plateNumber: true,
                type: true,
                owner: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Calculate payment summary
    const totalPaid = invoice.payments
      .filter(p => p.status === 'Completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = invoice.totalAmount - totalPaid;

    res.json({
      success: true,
      data: {
        ...invoice,
        paymentSummary: {
          totalPaid,
          pendingAmount,
          isFullyPaid: pendingAmount <= 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invoice by job ID
 */
const getInvoiceByJobId = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { jobId },
      include: {
        job: {
          select: {
            id: true,
            goodsType: true,
            status: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found for this job'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  getInvoiceByJobId
};