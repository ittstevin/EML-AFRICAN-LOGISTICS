import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './context/authStore'
import { useEffect, useState } from 'react'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import TruckManagementPage from './pages/trucks/TruckManagementPage'
import JobManagementPage from './pages/jobs/JobManagementPage'
import JobDetailsPage from './pages/jobs/JobDetailsPage'
import ApprovalWorkflowPage from './pages/workflow/ApprovalWorkflowPage'
import LoadingDispatchPage from './pages/dispatch/LoadingDispatchPage'
import DeliveryConfirmationPage from './pages/delivery/DeliveryConfirmationPage'
import InvoiceListPage from './pages/invoices/InvoiceListPage'
import InvoiceDetailsPage from './pages/invoices/InvoiceDetailsPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import ProfilePage from './pages/profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize auth from localStorage on mount
  useEffect(() => {
    initializeAuth()
    setIsInitialized(true)
  }, []) // Empty dependency array - only run once on mount

  // Don't render routes until auth is initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }


  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trucks" element={<TruckManagementPage />} />
          <Route path="/jobs" element={<JobManagementPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/approval" element={<ApprovalWorkflowPage />} />
          <Route path="/dispatch" element={<LoadingDispatchPage />} />
          <Route path="/delivery" element={<DeliveryConfirmationPage />} />
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect root to dashboard or login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
