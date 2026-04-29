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

// Get all invoices (Admin/Operator only)
router.get('/', authorize('admin', 'operator'), getInvoices);

// Get invoice by ID (Admin/Operator only)
router.get('/:id', authorize('admin', 'operator'), getInvoiceById);

// Get invoices for a job (Admin/Operator only)
router.get('/job/:jobId', authorize('admin', 'operator'), getInvoicesByJobId);

module.exports = router;