import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Lock } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { invoicesAPI } from '../../api/services'
import { formatCurrency, formatDate, paymentStatusConfig } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchInvoice()
  }, [invoiceId])

  const fetchInvoice = async () => {
    try {
      const response = await invoicesAPI.getById(invoiceId)
      setInvoice(response.data?.data)
    } catch (err) {
      toast.error('Failed to load invoice')
      navigate('/invoices')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await invoicesAPI.getPDF(invoiceId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentChild.removeChild(link)
      toast.success('Invoice downloaded')
    } catch (err) {
      toast.error('Failed to download invoice')
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (!invoice) return <div className="text-center py-12">Invoice not found</div>

  const statusConfig = paymentStatusConfig[invoice.paymentStatus] || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/invoices')} className="p-2 hover:bg-gray-200 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice #{invoiceId?.slice(0, 8)}</h1>
          <p className="text-gray-600">Issued on {formatDate(invoice.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={handleDownloadPDF} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardBody className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">HaulSync</h2>
                  <p className="text-gray-600">Transport & Truck Management</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-bold text-lg text-gray-900">{invoiceId?.slice(0, 8)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-gray-200 pt-8">
                <div>
                  <p className="text-xs text-gray-600 uppercase">From</p>
                  <p className="font-semibold text-gray-900">HaulSync Company</p>
                  <p className="text-sm text-gray-600">contact@haulsync.com</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 uppercase">Bill To</p>
                  <p className="font-semibold text-gray-900">{invoice.customerName}</p>
                  <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Invoice Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {invoice.items && invoice.items.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase py-2">Description</th>
                            <th className="text-right text-xs font-semibold text-gray-600 uppercase py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                              <td className="py-3 text-gray-900">{item.description}</td>
                              <td className="py-3 text-right text-gray-900">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-end space-x-12">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                      </div>
                      {invoice.tax > 0 && (
                        <div className="flex justify-end space-x-12">
                          <span className="text-gray-600">Tax (%):</span>
                          <span className="font-semibold">{formatCurrency(invoice.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-end space-x-12 bg-gray-50 p-3 rounded -mx-4 px-3">
                        <span className="font-bold text-gray-900">Total:</span>
                        <span className="font-bold text-lg text-primary-600">{formatCurrency(invoice.amount)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">No items in this invoice</p>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Terms */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-bold text-gray-900">Notes</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">{invoice.notes}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Status</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <Badge variant={statusConfig.color}>{statusConfig.label}</Badge>
              </div>

              {invoice.isFinalized && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <Lock size={16} className="text-amber-600" />
                  <span className="text-sm text-amber-700">This invoice is finalized</span>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Important Dates</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase">Issued Date</p>
                <p className="font-semibold text-gray-900">{formatDate(invoice.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Due Date</p>
                <p className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
              {invoice.paidDate && (
                <div>
                  <p className="text-xs text-gray-600 uppercase">Paid Date</p>
                  <p className="font-semibold text-green-600">{formatDate(invoice.paidDate)}</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Payment Info</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(invoice.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Paid Amount</p>
                <p className="font-semibold text-gray-900">{formatCurrency(invoice.paidAmount || 0)}</p>
              </div>
              {invoice.amount > (invoice.paidAmount || 0) && (
                <div>
                  <p className="text-xs text-gray-600 uppercase">Outstanding</p>
                  <p className="font-semibold text-orange-600">
                    {formatCurrency(invoice.amount - (invoice.paidAmount || 0))}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Actions */}
          {!invoice.isFinalized && (
            <Button fullWidth onClick={() => navigate(`/payments?invoiceId=${invoiceId}`)}>
              Make Payment
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
