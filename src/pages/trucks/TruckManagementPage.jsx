import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import { TextInput, Select } from '../../components/common/FormFields'
import { trucksAPI } from '../../api/services'
import { truckStatusConfig } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function TruckManagementPage() {
  const [trucks, setTrucks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    capacity: '',
    status: 'available',
    driverName: '',
    year: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      setIsLoading(true)
      const response = await trucksAPI.getAll()
      setTrucks(response.data?.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load trucks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (truck = null) => {
    if (truck) {
      setSelectedTruck(truck)
      setFormData({
        plateNumber: truck.plateNumber,
        model: truck.model,
        capacity: truck.capacity,
        status: truck.status,
        driverName: truck.driverName,
        year: truck.year,
      })
    } else {
      setSelectedTruck(null)
      setFormData({
        plateNumber: '',
        model: '',
        capacity: '',
        status: 'available',
        driverName: '',
        year: new Date().getFullYear(),
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTruck(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTruck) {
        await trucksAPI.update(selectedTruck.id, formData)
        toast.success('Truck updated successfully')
      } else {
        await trucksAPI.create(formData)
        toast.success('Truck added successfully')
      }
      fetchTrucks()
      handleCloseModal()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save truck')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this truck?')) {
      try {
        await trucksAPI.delete(id)
        toast.success('Truck deleted successfully')
        fetchTrucks()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete truck')
      }
    }
  }

  const columns = [
    { key: 'plateNumber', label: 'Plate Number' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    {
      key: 'capacity',
      label: 'Capacity (kg)',
      render: (row) => (row.capacity ? row.capacity.toLocaleString() : '-'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const config = truckStatusConfig[row.status] || {}
        return <Badge variant={config.color}>{config.label}</Badge>
      },
    },
    { key: 'driverName', label: 'Driver' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 hover:bg-red-100 rounded text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Truck Management</h1>
          <p className="text-gray-600">Manage all trucks in your fleet</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          <Plus className="inline mr-2" size={20} />
          Add Truck
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table columns={columns} data={trucks} isLoading={isLoading} emptyMessage="No trucks found. Add one to get started!" />
        </CardBody>
      </Card>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedTruck ? 'Edit Truck' : 'Add New Truck'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Plate Number"
              name="plateNumber"
              placeholder="E.g., ABC-1234"
              value={formData.plateNumber}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Model"
              name="model"
              placeholder="E.g., Volvo FH16"
              value={formData.model}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
            />
            <TextInput
              label="Capacity (kg)"
              name="capacity"
              type="number"
              placeholder="E.g., 20000"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <TextInput
            label="Driver Name"
            name="driverName"
            placeholder="Assigned driver name"
            value={formData.driverName}
            onChange={handleChange}
          />

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'available', label: 'Available' },
              { value: 'in_transit', label: 'In Transit' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
            required
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" fullWidth>
              {selectedTruck ? 'Update Truck' : 'Add Truck'}
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
