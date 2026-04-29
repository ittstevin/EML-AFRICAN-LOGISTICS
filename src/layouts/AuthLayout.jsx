import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">HaulSync</h1>
            <p className="text-gray-600">Transport & Truck Management System</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
