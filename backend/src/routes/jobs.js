const express = require('express');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  approveJob,
  loadJob,
  confirmDelivery,
  completeJob
} = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, createJobSchema, updateJobSchema } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all jobs
router.get('/', getJobs);

// Get job by ID
router.get('/:id', getJobById);

// Create job (Operator/Admin only)
router.post('/', authorize('admin', 'operator'), validate(createJobSchema), createJob);

// Update job (Operator/Admin only)
router.put('/:id', authorize('admin', 'operator'), validate(updateJobSchema), updateJob);

// Approve job (Admin/Operator only)
router.patch('/:id/approve', authorize('admin', 'operator'), approveJob);

// Load job (Operator/Admin only)
router.patch('/:id/load', authorize('admin', 'operator'), loadJob);

// Confirm delivery (Driver only)
router.patch('/:id/deliver', authorize('admin', 'operator', 'driver'), confirmDelivery);

// Complete job (Admin/Operator only)
router.patch('/:id/complete', authorize('admin', 'operator'), completeJob);

module.exports = router;