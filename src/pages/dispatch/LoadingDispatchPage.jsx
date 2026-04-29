import { useEffect, useState } from 'react'
import { Package, Loader } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { TextInput } from '../../components/common/FormFields'
import { jobsAPI } from '../../api/services'
import { jobStatusConfig, formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function LoadingDispatchPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [itemDetails, setItemDetails] = useState({ count: '', weight: '' })

  useEffect(() => {
    fetchApprovedJobs()
  }, [])

  const fetchApprovedJobs = async () => {
    try {
      const response = await jobsAPI.getAll({ status: 'approved' })
      setJobs(response.data?.data || [])
    } catch (err) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (job) => {
    setSelectedJob(job)
    setItemDetails({ count: '', weight: '' })
    setIsModalOpen(true)
  }

  const handleMarkLoaded = async () => {
    if (!itemDetails.count || !itemDetails.weight) {
      toast.error('Please fill in all details')
      return
    }

    try {
      await jobsAPI.updateStatus(selectedJob.id, 'loaded')
      toast.success('Job marked as loaded')
      setIsModalOpen(false)
      fetchApprovedJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark as loaded')
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Job ID',
      render: (row) => <span className="font-semibold text-primary-600">{row.id?.slice(0, 8)}</span>,
    },
    { key: 'pickupLocation', label: 'Pickup Location' },
    { key: 'deliveryLocation', label: 'Delivery Location' },
    {
      key: 'weight',
      label: 'Weight (kg)',
      render: (row) => row.weight?.toLocaleString(),
    },
    { key: 'distance', label: 'Distance (km)' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="sm" onClick={() => handleOpenModal(row)}>
          <Package size={16} className="mr-2" />
          Mark as Loaded
        </Button>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Loading & Dispatch</h1>
        <p className="text-gray-600">Mark approved jobs as loaded for dispatch</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
            <p className="text-sm text-gray-600">Ready for Loading</p>
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
            emptyMessage="No jobs ready for loading"
          />
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Mark Job as Loaded" size="md">
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Job ID</p>
              <p className="font-semibold text-gray-900">{selectedJob.id?.slice(0, 8)}</p>
            </div>

            <TextInput
              label="Number of Items"
              type="number"
              placeholder="How many items?"
              value={itemDetails.count}
              onChange={(e) => setItemDetails({ ...itemDetails, count: e.target.value })}
              required
            />

            <TextInput
              label="Total Weight (kg)"
              type="number"
              placeholder="Verified weight"
              value={itemDetails.weight}
              onChange={(e) => setItemDetails({ ...itemDetails, weight: e.target.value })}
              required
            />

            <div className="flex space-x-3">
              <Button fullWidth onClick={handleMarkLoaded}>
                <Loader size={16} className="mr-2" />
                Mark as Loaded
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
