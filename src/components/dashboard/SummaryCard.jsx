import { TrendingUp, TrendingDown } from 'lucide-react'

export default function SummaryCard({ title, value, icon: Icon, change, changeType = 'up', loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeType === 'up' ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${changeType === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="bg-primary-100 rounded-lg p-3">
            <Icon size={32} className="text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}
