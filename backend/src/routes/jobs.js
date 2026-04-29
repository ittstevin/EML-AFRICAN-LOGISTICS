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

// Create job
router.post('/', validate(createJobSchema), createJob);

// Update job
router.put('/:id', validate(updateJobSchema), updateJob);

// Approve job (Admin/Operator only)
router.patch('/:id/approve', authorize('Admin', 'Operator'), approveJob);

// Load job
router.patch('/:id/load', loadJob);

// Confirm delivery
router.patch('/:id/deliver', confirmDelivery);

// Complete job
router.patch('/:id/complete', completeJob);

module.exports = router;