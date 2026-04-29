/**
 * Pricing service for calculating job costs
 * This is a simplified pricing engine
 * In production, this could be more complex with database-stored rules
 */

const BASE_RATE_PER_KM = 0.5; // $0.50 per km
const BASE_RATE_PER_HOUR = 10; // $10 per hour
const GOODS_TYPE_MULTIPLIERS = {
  'general': 1.0,
  'fragile': 1.5,
  'hazardous': 2.0,
  'perishable': 1.3,
  'bulk': 0.8
};
const TRUCK_TYPE_MULTIPLIERS = {
  'small': 1.0,
  'medium': 1.2,
  'large': 1.5,
  'heavy': 2.0
};

/**
 * Calculate price for a job
 */
const calculatePrice = (jobData) => {
  const { distance, estimatedTime, goodsType, truckType } = jobData;

  // Base cost from distance
  const distanceCost = distance * BASE_RATE_PER_KM;

  // Base cost from time
  const timeCost = estimatedTime * BASE_RATE_PER_HOUR;

  // Goods type multiplier
  const goodsMultiplier = GOODS_TYPE_MULTIPLIERS[goodsType.toLowerCase()] || 1.0;

  // Truck type multiplier
  const truckMultiplier = TRUCK_TYPE_MULTIPLIERS[truckType.toLowerCase()] || 1.0;

  // Total cost
  const totalCost = (distanceCost + timeCost) * goodsMultiplier * truckMultiplier;

  // Round to 2 decimal places
  const roundedCost = Math.round(totalCost * 100) / 100;

  return {
    total: roundedCost,
    breakdown: {
      distanceCost: Math.round(distanceCost * 100) / 100,
      timeCost: Math.round(timeCost * 100) / 100,
      goodsMultiplier,
      truckMultiplier,
      finalMultiplier: goodsMultiplier * truckMultiplier
    }
  };
};

/**
 * Validate pricing rules
 * In production, this could load rules from database
 */
const validatePricingRules = () => {
  // For now, just return true
  // Could validate against admin-defined rules
  return true;
};

module.exports = {
  calculatePrice,
  validatePricingRules,
  GOODS_TYPE_MULTIPLIERS,
  TRUCK_TYPE_MULTIPLIERS
};