import { create } from 'zustand'
import { apiClient } from '../api/client'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')

    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      })
      // Set default authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { token, user } = response.data.data

      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      return { success: true, data: user }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  // Register
  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post('/auth/register', userData)
      const user = response.data.data

      localStorage.setItem('user', JSON.stringify(user))

      set({
        user,
        isAuthenticated: false,
        isLoading: false,
      })

      return { success: true, data: user }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    delete apiClient.defaults.headers.common['Authorization']

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    })
  },

  // Update user profile
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.put('/auth/profile', userData)
      const { user } = response.data

      localStorage.setItem('user', JSON.stringify(user))
      set({ user, isLoading: false })

      return { success: true, data: user }
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed'
      set({ error: message, isLoading: false })
      return { success: false, error: message }
    }
  },

  clearError: () => set({ error: null }),
}))
