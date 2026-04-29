import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import Button from '../components/common/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="mb-8">
          <AlertTriangle size={80} className="mx-auto opacity-80" />
        </div>
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-2">Page Not Found</p>
        <p className="text-primary-100 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="bg-white text-primary-600 hover:bg-gray-100">
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
