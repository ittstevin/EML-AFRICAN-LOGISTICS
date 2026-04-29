import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Package,
  CheckCircle,
  Loader,
  Truck as DeliveryIcon,
  FileText,
  CreditCard,
  Bell,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { useAuthStore } from '../../context/authStore'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' }, // All roles
  { label: 'Trucks', icon: Truck, path: '/trucks', adminOperatorOnly: true }, // Admin, Operator only
  { label: 'Jobs', icon: Package, path: '/jobs' }, // All roles (different permissions)
  { label: 'Approval', icon: CheckCircle, path: '/approval', adminOnly: true }, // Admin only
  { label: 'Dispatch', icon: Loader, path: '/dispatch', operatorOnly: true }, // Operator only
  { label: 'Delivery', icon: DeliveryIcon, path: '/delivery' }, // All roles can see deliveries
  { label: 'Invoices', icon: FileText, path: '/invoices', adminOperatorOnly: true }, // Admin, Operator only
  { label: 'Payments', icon: CreditCard, path: '/payments', adminOperatorOnly: true }, // Admin, Operator only
  { label: 'Notifications', icon: Bell, path: '/notifications' }, // All roles
]

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleNavigation = (path) => {
    navigate(path)
    onClose && onClose()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false
    if (item.adminOperatorOnly && !['admin', 'operator'].includes(user?.role)) return false
    if (item.operatorOnly && user?.role !== 'operator') return false
    return true
  })

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out z-50 lg:relative lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-400">EML AFRICAN</h1>
            <p className="text-xs text-gray-400">Logistics</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <button
            onClick={() => handleNavigation('/profile')}
            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
          >
            <User size={20} />
            <span>Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
