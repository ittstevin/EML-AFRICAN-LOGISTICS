const Joi = require('joi');

// User validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('Admin', 'Operator', 'Driver').default('Driver')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Truck validation schemas
const createTruckSchema = Joi.object({
  plateNumber: Joi.string().min(3).max(20).required(),
  type: Joi.string().min(2).max(50).required(),
  capacity: Joi.number().positive().required(),
  ownerId: Joi.string().required()
});

const updateTruckSchema = Joi.object({
  plateNumber: Joi.string().min(3).max(20),
  type: Joi.string().min(2).max(50),
  capacity: Joi.number().positive(),
  status: Joi.string().valid('Available', 'InTransit', 'Maintenance'),
  ownerId: Joi.string()
}).min(1); // At least one field required

// Job validation schemas
const createJobSchema = Joi.object({
  goodsType: Joi.string().min(2).max(100).required(),
  weight: Joi.number().positive().required(),
  pickupLocation: Joi.string().min(2).max(200).required(),
  deliveryLocation: Joi.string().min(2).max(200).required(),
  distance: Joi.number().positive().required(),
  estimatedTime: Joi.number().integer().positive().required(),
  truckId: Joi.string().optional()
});

const updateJobSchema = Joi.object({
  goodsType: Joi.string().min(2).max(100),
  weight: Joi.number().positive(),
  pickupLocation: Joi.string().min(2).max(200),
  deliveryLocation: Joi.string().min(2).max(200),
  distance: Joi.number().positive(),
  estimatedTime: Joi.number().integer().positive(),
  status: Joi.string().valid('Pending', 'Approved', 'Loaded', 'InTransit', 'Delivered', 'Completed'),
  truckId: Joi.string().allow(null)
}).min(1);

// Payment validation schemas
const createPaymentSchema = Joi.object({
  invoiceId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('Cash', 'MobileMoney', 'Bank').required()
});

// Middleware function to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  createTruckSchema,
  updateTruckSchema,
  createJobSchema,
  updateJobSchema,
  createPaymentSchema,
  validate
};