const express = require('express');
const {
  getPayments,
  getPaymentById,
  createPayment,
  createBulkPayment
} = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, createPaymentSchema } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all payments (Admin/Operator only)
router.get('/', authorize('admin', 'operator'), getPayments);

// Get payment by ID (Admin/Operator only)
router.get('/:id', authorize('admin', 'operator'), getPaymentById);

// Create single payment (Admin/Operator only)
router.post('/', authorize('admin', 'operator'), validate(createPaymentSchema), createPayment);

// Create bulk payment (Admin only)
router.post('/bulk', authorize('admin'), createBulkPayment);

module.exports = router;