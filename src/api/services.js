import apiClient from './client'

// Auth API
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
}

// Trucks API
export const trucksAPI = {
  getAll: () => apiClient.get('/trucks'),
  getById: (id) => apiClient.get(`/trucks/${id}`),
  create: (data) => apiClient.post('/trucks', data),
  update: (id, data) => apiClient.put(`/trucks/${id}`, data),
  delete: (id) => apiClient.delete(`/trucks/${id}`),
}

// Jobs API
export const jobsAPI = {
  getAll: (filters = {}) => apiClient.get('/jobs', { params: filters }),
  getById: (id) => apiClient.get(`/jobs/${id}`),
  create: (data) => apiClient.post('/jobs', data),
  update: (id, data) => apiClient.put(`/jobs/${id}`, data),
  getApprovalList: () => apiClient.get('/jobs?status=pending'),
}

// Invoices API
export const invoicesAPI = {
  getAll: (filters = {}) => apiClient.get('/invoices', { params: filters }),
  getById: (id) => apiClient.get(`/invoices/${id}`),
  getByJobId: (jobId) => apiClient.get(`/invoices/job/${jobId}`),
}

// Payments API
export const paymentsAPI = {
  getAll: (filters = {}) => apiClient.get('/payments', { params: filters }),
  getById: (id) => apiClient.get(`/payments/${id}`),
  recordPayment: (data) => apiClient.post('/payments', data),
  recordBulkPayment: (data) => apiClient.post('/payments/bulk', data),
}

// Approval/Workflow API
export const approvalAPI = {
  getPendingJobs: () => apiClient.get('/jobs?status=pending'),
  approveJob: (jobId) => apiClient.patch(`/jobs/${jobId}/approve`),
  markAsLoaded: (jobId, confirmationCode = null) => apiClient.patch(`/jobs/${jobId}/load`, confirmationCode ? { confirmationCode } : {}),
  confirmDelivery: (jobId, confirmationCode) => apiClient.patch(`/jobs/${jobId}/deliver`, { confirmationCode }),
  completeJob: (jobId) => apiClient.patch(`/jobs/${jobId}/complete`),
}

// Dashboard API
export const dashboardAPI = {
  getSummary: () => apiClient.get('/dashboard/summary'),
  getRecentActivity: () => apiClient.get('/dashboard/activity'),
}

// Notifications API
export const notificationsAPI = {
  getAll: () => apiClient.get('/notifications'),
  getUnread: () => apiClient.get('/notifications?status=unread'),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
}

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/auth/profile'),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
}
