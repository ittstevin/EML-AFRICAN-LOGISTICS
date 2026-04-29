import { useEffect, useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Table } from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { Textarea } from '../../components/common/FormFields'
import { approvalAPI } from '../../api/services'
import { jobStatusConfig, formatCurrency, formatDate } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ApprovalWorkflowPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchPendingJobs()
  }, [])

  const fetchPendingJobs = async () => {
    try {
      const response = await approvalAPI.getPendingJobs()
      setJobs(response.data?.data || [])
    } catch (err) {
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (jobId) => {
    try {
      await approvalAPI.approveJob(jobId)
      toast.success('Job approved successfully')
      fetchPendingJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve job')
    }
  }

  const handleReject = async (jobId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      await approvalAPI.rejectJob(jobId, rejectReason)
      toast.success('Job rejected successfully')
      setIsRejectModalOpen(false)
      setRejectReason('')
      fetchPendingJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject job')
    }
  }

  const handleOpenRejectModal = (job) => {
    setSelectedJob(job)
    setRejectReason('')
    setIsRejectModalOpen(true)
  }

  const columns = [
    { key: 'id', label: 'Job ID', render: (row) => <span className="font-semibold">{row.id?.slice(0, 8)}</span> },
    {
      key: 'goodsType',
      label: 'Goods Type',
      render: (row) => <span className="capitalize">{row.goodsType}</span>,
    },
    { key: 'pickupLocation', label: 'Pickup' },
    { key: 'deliveryLocation', label: 'Delivery' },
    { key: 'weight', label: 'Weight (kg)', render: (row) => row.weight?.toLocaleString() },
    { key: 'distance', label: 'Distance (km)' },
    {
      key: 'estimatedCost',
      label: 'Cost',
      render: (row) => formatCurrency(row.estimatedCost),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => handleApprove(row.id)}
            className="flex items-center space-x-1"
          >
            <CheckCircle size={16} />
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleOpenRejectModal(row)}
            className="flex items-center space-x-1"
          >
            <XCircle size={16} />
            Reject
          </Button>
        </div>
      ),
    },
  ]

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Approval Workflow</h1>
        <p className="text-gray-600">Review and approve pending jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-3xl font-bold text-primary-600">{jobs.length}</p>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </CardBody>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table columns={columns} data={jobs} isLoading={false} emptyMessage="No pending jobs for approval" />
        </CardBody>
      </Card>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Job" size="md">
        <div className="space-y-4">
          {selectedJob && (
            <>
              <p className="text-gray-700">
                Are you sure you want to reject job <span className="font-semibold">{selectedJob.id?.slice(0, 8)}</span>?
              </p>
              <Textarea
                label="Rejection Reason"
                placeholder="Explain why this job is being rejected"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                required
              />
              <div className="flex space-x-3">
                <Button
                  fullWidth
                  variant="danger"
                  onClick={() => handleReject(selectedJob.id)}
                >
                  Reject Job
                </Button>
                <Button fullWidth variant="secondary" onClick={() => setIsRejectModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
