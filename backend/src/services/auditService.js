const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Log an action to the audit log
 */
const logAction = async (userId, action, details = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details ? JSON.stringify(details) : null
      }
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
    // Don't throw error to avoid breaking main flow
  }
};

/**
 * Get audit logs with pagination
 */
const getAuditLogs = async (page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    }),
    prisma.auditLog.count()
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get audit logs for a specific user
 */
const getUserAuditLogs = async (userId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: {
        timestamp: 'desc'
      }
    }),
    prisma.auditLog.count({ where: { userId } })
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  logAction,
  getAuditLogs,
  getUserAuditLogs
};