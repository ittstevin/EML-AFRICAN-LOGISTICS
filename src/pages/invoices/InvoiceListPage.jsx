import { useEffect, useState } from 'react'
import { Eye, Download, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import { invoicesAPI } from '../../api/services'
import { formatCurrency, formatDate, paymentStatusConfig } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function InvoiceListPage() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await invoicesAPI.getAll()
      setInvoices(response.data?.data || [])
    } catch (err) {
      toast.error('Failed to load invoices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async (id) => {
    try {
      const response = await invoicesAPI.getPDF(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentChild.removeChild(link)
      toast.success('Invoice downloaded')
    } catch (err) {
      toast.error('Failed to download invoice')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await invoicesAPI.delete(id)
        toast.success('Invoice deleted')
        fetchInvoices()
      } catch (err) {
        toast.error('Failed to delete invoice')
      }
    }
  }

  const columns = [
    {
      key: 'id',
      label: 'Invoice ID',
      render: (row) => <span className="font-semibold text-primary-600">{row.id?.slice(0, 8)}</span>,
    },
    { key: 'jobId', label: 'Job ID', render: (row) => row.jobId?.slice(0, 8) },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (row) => {
        const config = paymentStatusConfig[row.paymentStatus] || {}
        return <Badge variant={config.color}>{config.label}</Badge>
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => formatDate(row.dueDate),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/invoices/${row.id}`)}
            className="p-1 hover:bg-blue-100 rounded text-blue-600"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleDownloadPDF(row.id)}
            className="p-1 hover:bg-green-100 rounded text-green-600"
          >
            <Download size={18} />
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

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">View and manage all invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-primary-600">{invoices.length}</p>
            <p className="text-sm text-gray-600">Total Invoices</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {invoices.filter((i) => i.paymentStatus === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Paid</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {invoices.filter((i) => i.paymentStatus === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table columns={columns} data={invoices} isLoading={false} emptyMessage="No invoices found" />
        </CardBody>
      </Card>
    </div>
  )
}
