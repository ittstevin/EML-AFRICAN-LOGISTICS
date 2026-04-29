import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react'

export default function Alert({ type = 'info', message, onClose }) {
  const types = {
    success: { icon: CheckCircle, bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800', iconColor: 'text-green-600' },
    error: { icon: AlertCircle, bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-800', iconColor: 'text-red-600' },
    warning: { icon: AlertCircle, bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800', iconColor: 'text-yellow-600' },
    info: { icon: InfoIcon, bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800', iconColor: 'text-blue-600' },
  }

  const config = types[type]
  const Icon = config.icon

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 flex items-start space-x-3`}>
      <Icon className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} size={20} />
      <div className={`flex-1 ${config.textColor}`}>{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ×
        </button>
      )}
    </div>
  )
}

export function ErrorMessage({ message, onClose }) {
  return <Alert type="error" message={message} onClose={onClose} />
}

export function SuccessMessage({ message, onClose }) {
  return <Alert type="success" message={message} onClose={onClose} />
}

export function WarningMessage({ message, onClose }) {
  return <Alert type="warning" message={message} onClose={onClose} />
}

export function InfoMessage({ message, onClose }) {
  return <Alert type="info" message={message} onClose={onClose} />
}
