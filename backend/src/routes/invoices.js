const express = require('express');
const {
  getInvoices,
  getInvoiceById,
  getInvoiceByJobId
} = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all invoices
router.get('/', getInvoices);

// Get invoice by ID
router.get('/:id', getInvoiceById);

// Get invoice by job ID
router.get('/job/:jobId', getInvoiceByJobId);

module.exports = router;