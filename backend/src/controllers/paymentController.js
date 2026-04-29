const { PrismaClient } = require('@prisma/client');
const auditService = require('../services/auditService');

const prisma = new PrismaClient();

/**
 * Get all payments
 */
const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, invoiceId, method } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (invoiceId) where.invoiceId = invoiceId;
    if (method) where.method = method;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              job: {
                select: {
                  id: true,
                  goodsType: true
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count({ where })
    ]);

    res.json({
      success: true,
      data: payments,
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
 * Get payment by ID
 */
const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            job: {
              select: {
                id: true,
                goodsType: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new payment
 */
const createPayment = async (req, res, next) => {
  try {
    const { invoiceId, amount, method } = req.body;

    // Check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payments: {
          where: { status: 'Completed' }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Calculate total paid so far
    const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingAmount = invoice.totalAmount - totalPaid;

    if (amount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount exceeds remaining balance of ${remainingAmount}`
      });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount,
        method,
        status: 'Completed' // Assume payment succeeds for demo
      },
      include: {
        invoice: {
          select: {
            id: true,
            totalAmount: true,
            status: true
          }
        }
      }
    });

    // Update invoice status if fully paid
    const newTotalPaid = totalPaid + amount;
    if (newTotalPaid >= invoice.totalAmount) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'Paid' }
      });
    } else if (newTotalPaid > 0) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'Partial' }
      });
    }

    // Log payment
    await auditService.logAction(req.user.id, 'PAYMENT_CREATED', {
      paymentId: payment.id,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      method: payment.method
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process bulk payment (apply to multiple invoices)
 */
const createBulkPayment = async (req, res, next) => {
  try {
    const { payments } = req.body; // Array of { invoiceId, amount, method }

    if (!Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payments array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const paymentData of payments) {
      try {
        const { invoiceId, amount, method } = paymentData;

        // Check invoice
        const invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
          include: {
            payments: {
              where: { status: 'Completed' }
            }
          }
        });

        if (!invoice) {
          errors.push({ invoiceId, error: 'Invoice not found' });
          continue;
        }

        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingAmount = invoice.totalAmount - totalPaid;

        if (amount > remainingAmount) {
          errors.push({
            invoiceId,
            error: `Amount exceeds remaining balance of ${remainingAmount}`
          });
          continue;
        }

        // Create payment
        const payment = await prisma.payment.create({
          data: {
            invoiceId,
            amount,
            method,
            status: 'Completed'
          }
        });

        // Update invoice status
        const newTotalPaid = totalPaid + amount;
        if (newTotalPaid >= invoice.totalAmount) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'Paid' }
          });
        } else if (newTotalPaid > 0) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'Partial' }
          });
        }

        results.push(payment);

        // Log payment
        await auditService.logAction(req.user.id, 'BULK_PAYMENT_CREATED', {
          paymentId: payment.id,
          invoiceId: payment.invoiceId,
          amount: payment.amount,
          method: payment.method
        });

      } catch (error) {
        errors.push({
          invoiceId: paymentData.invoiceId,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Processed ${results.length} payments successfully`,
      data: {
        successful: results,
        failed: errors
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayments,
  getPaymentById,
  createPayment,
  createBulkPayment
};