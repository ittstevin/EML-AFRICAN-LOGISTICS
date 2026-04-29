import { useEffect, useState } from 'react'
import { Plus, Eye, Trash2, MapPin, Package, Truck as TruckIcon } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import { TextInput, Select, Textarea } from '../../components/common/FormFields'
import { useAuthStore } from '../../context/authStore'
import { jobsAPI, trucksAPI } from '../../api/services'
import { jobStatusConfig, formatCurrency, calculateJobCost } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function JobManagementPage() {
  const { user } = useAuthStore()
  const [jobs, setJobs] = useState([])
  const [trucks, setTrucks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const isAdmin = user?.role === 'admin'
  const isOperator = user?.role === 'operator'
  const canEdit = isAdmin || isOperator
  const [formData, setFormData] = useState({
    goodsType: 'general',
    weight: '',
    pickupLocation: '',
    deliveryLocation: '',
    distance: '',
    assignedTruck: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [jobsRes, trucksRes] = await Promise.all([jobsAPI.getAll(), trucksAPI.getAll()])
      setJobs(jobsRes.data?.data || [])
      setTrucks(trucksRes.data?.data || [])
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (job = null) => {
    if (job) {
      setSelectedJob(job)
      setFormData({
        goodsType: job.goodsType,
        weight: job.weight,
        pickupLocation: job.pickupLocation,
        deliveryLocation: job.deliveryLocation,
        distance: job.distance,
        assignedTruck: job.assignedTruck?.id || '',
        notes: job.notes,
      })
    } else {
      setSelectedJob(null)
      setFormData({
        goodsType: 'general',
        weight: '',
        pickupLocation: '',
        deliveryLocation: '',
        distance: '',
        assignedTruck: '',
        notes: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        weight: parseInt(formData.weight),
        distance: parseInt(formData.distance),
        estimatedCost: calculateJobCost(parseInt(formData.distance), parseInt(formData.weight), formData.goodsType),
      }

      if (selectedJob) {
        await jobsAPI.update(selectedJob.id, payload)
        toast.success('Job updated successfully')
      } else {
        await jobsAPI.create(payload)
        toast.success('Job created successfully')
      }
      fetchData()
      handleCloseModal()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobsAPI.delete(id)
        toast.success('Job deleted successfully')
        fetchData()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete job')
      }
    }
  }

  const truckOptions = trucks.map((truck) => ({
    value: truck.id,
    label: `${truck.plateNumber} - ${truck.model}`,
  }))

  const goodsTypeOptions = [
    { value: 'general', label: 'General Cargo' },
    { value: 'fragile', label: 'Fragile' },
    { value: 'hazmat', label: 'Hazardous Materials' },
    { value: 'perishable', label: 'Perishable' },
  ]

  const columns = [
    {
      key: 'id',
      label: 'Job ID',
      render: (row) => <span className="font-semibold text-primary-600">{row.id?.slice(0, 8)}</span>,
    },
    {
      key: 'goodsType',
      label: 'Goods Type',
      render: (row) => <span className="capitalize">{row.goodsType}</span>,
    },
    {
      key: 'pickupLocation',
      label: 'Pickup',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <MapPin size={16} className="text-gray-400" />
          <span className="truncate max-w-xs">{row.pickupLocation}</span>
        </div>
      ),
    },
    {
      key: 'deliveryLocation',
      label: 'Delivery',
      render: (row) => (
        <div className="flex items-center space-x-1">
          <MapPin size={16} className="text-gray-400" />
          <span className="truncate max-w-xs">{row.deliveryLocation}</span>
        </div>
      ),
    },
    {
      key: 'weight',
      label: 'Weight (kg)',
      render: (row) => row.weight?.toLocaleString(),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const config = jobStatusConfig[row.status] || {}
        return <Badge variant={config.color}>{config.label}</Badge>
      },
    },
    {
      key: 'estimatedCost',
      label: 'Cost',
      render: (row) => formatCurrency(row.estimatedCost),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button onClick={() => handleOpenModal(row)} className="p-1 hover:bg-blue-100 rounded text-blue-600">
            <Eye size={18} />
          </button>
          {canEdit && (
            <button onClick={() => handleDelete(row.id)} className="p-1 hover:bg-red-100 rounded text-red-600">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Create and manage shipping jobs</p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="inline mr-2" size={20} />
            Create Job
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table columns={columns} data={jobs} isLoading={false} emptyMessage="No jobs found. Create one to get started!" />
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedJob ? 'Edit Job' : 'Create New Job'} size="2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Goods Type"
              name="goodsType"
              options={goodsTypeOptions}
              value={formData.goodsType}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Weight (kg)"
              name="weight"
              type="number"
              placeholder="E.g., 5000"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Distance (km)"
              name="distance"
              type="number"
              placeholder="E.g., 150"
              value={formData.distance}
              onChange={handleChange}
              required
            />
            <Select
              label="Assign Truck"
              name="assignedTruck"
              options={truckOptions}
              value={formData.assignedTruck}
              onChange={handleChange}
            />
          </div>

          <TextInput
            label="Pickup Location"
            name="pickupLocation"
            placeholder="Enter pickup address"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Delivery Location"
            name="deliveryLocation"
            placeholder="Enter delivery address"
            value={formData.deliveryLocation}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Notes"
            name="notes"
            placeholder="Additional information"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />

          {formData.distance && formData.weight && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">
                <strong>Estimated Cost:</strong>{' '}
                {formatCurrency(
                  calculateJobCost(parseInt(formData.distance) || 0, parseInt(formData.weight) || 0, formData.goodsType)
                )}
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" fullWidth>
              {selectedJob ? 'Update Job' : 'Create Job'}
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={handleCloseModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
