import { useEffect, useState } from 'react'
import { DollarSign, Truck, Package, Clock } from 'lucide-react'
import SummaryCard from '../../components/dashboard/SummaryCard'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/helpers'
import { dashboardAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await dashboardAPI.getSummary()
      setSummary(response.data?.data || {
        totalRevenue: 0,
        activeJobs: 0,
        completedJobs: 0,
        pendingPayments: 0,
        availableTrucks: 0,
        inTransit: 0,
        pendingJobs: 0,
        avgDeliveryTime: '-',
        revenueChange: 0,
        jobsChange: 0,
        completedChange: 0,
        paymentsChange: 0,
      })
    } catch (err) {
      // If dashboard endpoint doesn't exist, show empty state
      setSummary({
        totalRevenue: 0,
        activeJobs: 0,
        completedJobs: 0,
        pendingPayments: 0,
        availableTrucks: 0,
        inTransit: 0,
        pendingJobs: 0,
        avgDeliveryTime: '-',
        revenueChange: 0,
        jobsChange: 0,
        completedChange: 0,
        paymentsChange: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!summary) return <div>Failed to load dashboard</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          icon={DollarSign}
          change={summary.revenueChange}
        />
        <SummaryCard
          title="Active Jobs"
          value={summary.activeJobs}
          icon={Package}
          change={summary.jobsChange}
        />
        <SummaryCard
          title="Completed Jobs"
          value={summary.completedJobs}
          icon={Truck}
          change={summary.completedChange}
        />
        <SummaryCard
          title="Pending Payments"
          value={formatCurrency(summary.pendingPayments)}
          icon={Clock}
          change={summary.paymentsChange}
          changeType="down"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              {summary.recentActivity && summary.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {summary.recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Quick Stats</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold">Available Trucks</p>
                <p className="text-2xl font-bold text-blue-900">{summary.availableTrucks || 0}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-600 font-semibold">In Transit</p>
                <p className="text-2xl font-bold text-green-900">{summary.inTransit || 0}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-600 font-semibold">Pending Jobs</p>
                <p className="text-2xl font-bold text-yellow-900">{summary.pendingJobs || 0}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 font-semibold">Avg Delivery Time</p>
                <p className="text-lg font-bold text-purple-900">{summary.avgDeliveryTime || '-'}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
