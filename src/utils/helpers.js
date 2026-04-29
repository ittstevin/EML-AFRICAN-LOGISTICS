// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Format date
export const formatDate = (date, format = 'short') => {
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    time: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  }
  return new Date(date).toLocaleDateString('en-US', options[format] || options.short)
}

// Format time
export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate phone number
export const validatePhone = (phone) => {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return re.test(phone)
}

// Generate random ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Check if value is empty
export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)
  )
}

// Job status labels and colors
export const jobStatusConfig = {
  pending: { label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  approved: { label: 'Approved', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  loaded: { label: 'Loaded', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
  in_transit: { label: 'In Transit', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
  delivered: { label: 'Delivered', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  completed: { label: 'Completed', color: 'emerald', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
  rejected: { label: 'Rejected', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
}

// Truck status labels and colors
export const truckStatusConfig = {
  available: { label: 'Available', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  in_transit: { label: 'In Transit', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
  maintenance: { label: 'Maintenance', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
}

// Payment status labels and colors
export const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  partial: { label: 'Partial', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  completed: { label: 'Completed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  failed: { label: 'Failed', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
}

// Calculate job cost (example logic - adjust based on your business rules)
export const calculateJobCost = (distance, weight, goodsType = 'general') => {
  const baseRate = 50 // Base rate per km
  const weightRate = 0.5 // Rate per kg
  const typeMultiplier = {
    general: 1,
    fragile: 1.5,
    hazmat: 2,
    perishable: 1.8,
  }

  const multiplier = typeMultiplier[goodsType] || 1
  return (distance * baseRate + weight * weightRate) * multiplier
}

// Generate invoice number
export const generateInvoiceNumber = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000)
  return `INV-${year}${month}-${String(random).padStart(5, '0')}`
}

// Generate job ID
export const generateJobId = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const random = Math.floor(Math.random() * 10000)
  return `JOB-${year}${month}-${String(random).padStart(5, '0')}`
}
