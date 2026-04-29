const authService = require('../services/authService');
const auditService = require('../services/auditService');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    // Log registration
    await auditService.logAction(user.id, 'USER_REGISTERED', {
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Log login
    await auditService.logAction(result.user.id, 'USER_LOGIN', {
      email: result.user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};