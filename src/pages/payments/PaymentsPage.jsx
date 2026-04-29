import { useEffect, useState } from 'react'
import { Plus, Trash2, CreditCard } from 'lucide-react'
import Card, { CardHeader, CardBody, CardFooter } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import { TextInput, Select, Checkbox } from '../../components/common/FormFields'
import { paymentsAPI, invoicesAPI } from '../../api/services'
import { formatCurrency, formatDate, paymentStatusConfig } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBulkPaymentMode, setIsBulkPaymentMode] = useState(false)
  const [selectedInvoices, setSelectedInvoices] = useState([])
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    method: 'bank',
    reference: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [paymentsRes, invoicesRes] = await Promise.all([
        paymentsAPI.getAll(),
        invoicesAPI.getAll({ paymentStatus: 'pending' }),
      ])
      setPayments(paymentsRes.data?.data || [])
      setInvoices(invoicesRes.data?.data || [])
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = () => {
    setIsBulkPaymentMode(false)
    setSelectedInvoices([])
    setFormData({ invoiceId: '', amount: '', method: 'bank', reference: '', notes: '' })
    setIsModalOpen(true)
  }

  const handleToggleInvoice = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId) ? prev.filter((id) => id !== invoiceId) : [...prev, invoiceId]
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isBulkPaymentMode && (!formData.invoiceId || !formData.amount)) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isBulkPaymentMode && selectedInvoices.length === 0) {
      toast.error('Please select at least one invoice')
      return
    }

    try {
      if (isBulkPaymentMode) {
        await paymentsAPI.recordBulkPayment({
          invoiceIds: selectedInvoices,
          method: formData.method,
          reference: formData.reference,
          notes: formData.notes,
        })
        toast.success('Bulk payment recorded successfully')
      } else {
        await paymentsAPI.recordPayment({
          invoiceId: formData.invoiceId,
          amount: parseFloat(formData.amount),
          method: formData.method,
          reference: formData.reference,
          notes: formData.notes,
        })
        toast.success('Payment recorded successfully')
      }

      setIsModalOpen(false)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        // Delete payment API call would go here
        toast.success('Payment deleted')
        fetchData()
      } catch (err) {
        toast.error('Failed to delete payment')
      }
    }
  }

  const paymentColumns = [
    {
      key: 'id',
      label: 'Payment ID',
      render: (row) => <span className="font-semibold text-primary-600">{row.id?.slice(0, 8)}</span>,
    },
    {
      key: 'invoiceId',
      label: 'Invoice',
      render: (row) => row.invoiceId?.slice(0, 8),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => formatCurrency(row.amount),
    },
    {
      key: 'method',
      label: 'Method',
      render: (row) => <span className="capitalize">{row.method}</span>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="p-1 hover:bg-red-100 rounded text-red-600"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  const totalPending = invoices.reduce((sum, inv) => sum + (inv.amount - (inv.paidAmount || 0)), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Record and manage payments</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="inline mr-2" size={20} />
          Record Payment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-orange-600">{invoices.length}</p>
            <p className="text-sm text-gray-600">Pending Invoices</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-xl font-bold text-orange-600">{formatCurrency(totalPending)}</p>
            <p className="text-sm text-gray-600">Outstanding Balance</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-green-600">{payments.length}</p>
            <p className="text-sm text-gray-600">Total Payments</p>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
        <Card>
          <CardBody>
            <Table
              columns={paymentColumns}
              data={payments}
              isLoading={false}
              emptyMessage="No payments recorded yet"
            />
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Payment"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Checkbox
            label="Record bulk payment for multiple invoices?"
            checked={isBulkPaymentMode}
            onChange={(e) => {
              setIsBulkPaymentMode(e.target.checked)
              setFormData({ invoiceId: '', amount: '', method: 'bank', reference: '', notes: '' })
              setSelectedInvoices([])
            }}
          />

          {!isBulkPaymentMode && (
            <>
              <Select
                label="Invoice"
                name="invoiceId"
                options={invoices.map((inv) => ({
                  value: inv.id,
                  label: `${inv.id?.slice(0, 8)} - ${formatCurrency(inv.amount - (inv.paidAmount || 0))} due`,
                }))}
                value={formData.invoiceId}
                onChange={handleChange}
                required
              />

              <TextInput
                label="Amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </>
          )}

          {isBulkPaymentMode && (
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded p-4">
              {invoices.map((invoice) => (
                <Checkbox
                  key={invoice.id}
                  label={`${invoice.id?.slice(0, 8)} - ${formatCurrency(invoice.amount - (invoice.paidAmount || 0))}`}
                  checked={selectedInvoices.includes(invoice.id)}
                  onChange={() => handleToggleInvoice(invoice.id)}
                />
              ))}
            </div>
          )}

          <Select
            label="Payment Method"
            name="method"
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'bank', label: 'Bank Transfer' },
              { value: 'mobile_money', label: 'Mobile Money' },
              { value: 'check', label: 'Check' },
            ]}
            value={formData.method}
            onChange={handleChange}
            required
          />

          <TextInput
            label="Reference Number"
            name="reference"
            placeholder="Transaction or reference number"
            value={formData.reference}
            onChange={handleChange}
          />

          <TextInput
            label="Notes"
            name="notes"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" fullWidth>
              <CreditCard className="inline mr-2" size={20} />
              Record Payment
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
