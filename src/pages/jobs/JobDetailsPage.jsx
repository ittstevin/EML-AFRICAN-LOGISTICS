import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Package, Truck, Calendar, DollarSign } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { jobsAPI } from '../../api/services'
import { jobStatusConfig, formatDate, formatCurrency } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function JobDetailsPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJob()
  }, [jobId])

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getById(jobId)
      setJob(response.data?.data)
    } catch (err) {
      toast.error('Failed to load job')
      navigate('/jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await jobsAPI.updateStatus(jobId, newStatus)
      toast.success(`Job status updated to ${newStatus}`)
      fetchJob()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!job) return <div className="text-center py-12">Job not found</div>

  const statusConfig = jobStatusConfig[job.status] || {}
  const statusFlow = ['pending', 'approved', 'loaded', 'in_transit', 'delivered', 'completed']
  const currentStatusIndex = statusFlow.indexOf(job.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/jobs')} className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job #{jobId.slice(0, 8)}</h1>
          <p className="text-gray-600">Created on {formatDate(job.createdAt)}</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        <Badge variant={statusConfig.color}>{statusConfig.label}</Badge>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Location Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-start space-x-4">
                <MapPin size={24} className="text-primary-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-semibold text-gray-900">{job.pickupLocation}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-start space-x-4">
                <MapPin size={24} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Location</p>
                  <p className="font-semibold text-gray-900">{job.deliveryLocation}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Cargo Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Cargo Details</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Goods Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{job.goodsType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-semibold text-gray-900">{job.weight.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-semibold text-gray-900">{job.distance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(job.estimatedCost)}</p>
                </div>
              </div>
              {job.notes && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-gray-900">{job.notes}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Truck Assignment */}
          {job.assignedTruck && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Assigned Truck</h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck size={24} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Plate Number</p>
                    <p className="font-semibold text-gray-900">{job.assignedTruck.plateNumber}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-semibold text-gray-900">{job.assignedTruck.model}</p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Workflow */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Status Workflow</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {statusFlow.map((status, idx) => (
                  <div key={status} className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx <= currentStatusIndex ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      ✓
                    </div>
                    <span className={idx <= currentStatusIndex ? 'font-semibold text-gray-900' : 'text-gray-500 capitalize'}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Actions</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {currentStatusIndex < statusFlow.length - 1 && (
                <Button
                  fullWidth
                  onClick={() => handleStatusChange(statusFlow[currentStatusIndex + 1])}
                  size="sm"
                >
                  Move to {statusFlow[currentStatusIndex + 1].replace('_', ' ')}
                </Button>
              )}
              <Button fullWidth variant="secondary" size="sm">
                Download Invoice
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
