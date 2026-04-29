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

// Dashboard API (mock data only)
export const dashboardAPI = {
  getSummary: () => Promise.resolve({ data: { success: true, data: {} } }),
  getRecentActivity: () => Promise.resolve({ data: { success: true, data: [] } }),
}

// Notifications API (mock data only)
export const notificationsAPI = {
  getAll: () => Promise.resolve({ data: { success: true, data: [] } }),
  getUnread: () => Promise.resolve({ data: { success: true, data: [] } }),
  markAsRead: (id) => Promise.resolve({ data: { success: true } }),
  markAllAsRead: () => Promise.resolve({ data: { success: true } }),
  delete: (id) => Promise.resolve({ data: { success: true } }),
}

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/auth/profile'),
  changePassword: (data) => Promise.resolve({ data: { success: true } }),
}
