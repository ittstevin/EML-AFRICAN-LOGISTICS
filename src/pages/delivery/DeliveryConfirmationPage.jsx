import { useEffect, useState } from 'react'
import { CheckCircle, MapPin } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Table } from '../../components/common/Table'
import Modal from '../../components/common/Modal'
import { TextInput } from '../../components/common/FormFields'
import { jobsAPI } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function DeliveryConfirmationPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [deliveryCode, setDeliveryCode] = useState('')

  useEffect(() => {
    fetchInTransitJobs()
  }, [])

  const fetchInTransitJobs = async () => {
    try {
      const response = await jobsAPI.getAll({ status: 'in_transit' })
      setJobs(response.data?.data || [])
    } catch (err) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (job) => {
    setSelectedJob(job)
    setDeliveryCode('')
    setIsModalOpen(true)
  }

  const handleConfirmDelivery = async () => {
    if (!deliveryCode.trim()) {
      toast.error('Please enter delivery confirmation')
      return
    }

    try {
      await jobsAPI.updateStatus(selectedJob.id, 'delivered')
      toast.success('Delivery confirmed successfully')
      setIsModalOpen(false)
      fetchInTransitJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm delivery')
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Job ID',
      render: (row) => <span className="font-semibold text-primary-600">{row.id?.slice(0, 8)}</span>,
    },
    {
      key: 'deliveryLocation',
      label: 'Delivery Location',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="truncate max-w-xs">{row.deliveryLocation}</span>
        </div>
      ),
    },
    { key: 'distance', label: 'Distance (km)' },
    {
      key: 'createdAt',
      label: 'Dispatched',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="sm" onClick={() => handleOpenModal(row)}>
          <CheckCircle size={16} className="mr-2" />
          Confirm Delivery
        </Button>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delivery Confirmation</h1>
        <p className="text-gray-600">Confirm deliveries when jobs are completed</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
            <p className="text-sm text-gray-600">Jobs in Transit</p>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table
            columns={columns}
            data={jobs}
            isLoading={false}
            emptyMessage="No jobs in transit"
          />
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Delivery" size="md">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Delivering to:</p>
              <p className="font-semibold text-gray-900">{selectedJob.deliveryLocation}</p>
            </div>

            <TextInput
              label="Delivery Confirmation"
              placeholder="Enter OTP or confirmation code"
              value={deliveryCode}
              onChange={(e) => setDeliveryCode(e.target.value)}
              required
            />

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                Please obtain signature or confirmation from the recipient before proceeding.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button fullWidth onClick={handleConfirmDelivery}>
                <CheckCircle size={16} className="mr-2" />
                Confirm Delivery
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
