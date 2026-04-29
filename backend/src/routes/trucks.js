const express = require('express');
const {
  getTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck
} = require('../controllers/truckController');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, createTruckSchema, updateTruckSchema } = require('../utils/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all trucks
router.get('/', getTrucks);

// Get truck by ID
router.get('/:id', getTruckById);

// Create truck (Admin/Operator only)
router.post('/', authorize('Admin', 'Operator'), validate(createTruckSchema), createTruck);

// Update truck (Admin/Operator only)
router.put('/:id', authorize('Admin', 'Operator'), validate(updateTruckSchema), updateTruck);

// Delete truck (Admin only)
router.delete('/:id', authorize('Admin'), deleteTruck);

module.exports = router;