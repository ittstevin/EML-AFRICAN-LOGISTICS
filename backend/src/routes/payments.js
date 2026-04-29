const express = require('express');
const {
  getPayments,
  getPaymentById,
  createPayment,
  createBulkPayment
} = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validate, createPaymentSchema } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all payments
router.get('/', getPayments);

// Get payment by ID
router.get('/:id', getPaymentById);

// Create single payment
router.post('/', validate(createPaymentSchema), createPayment);

// Create bulk payment
router.post('/bulk', createBulkPayment);

module.exports = router;