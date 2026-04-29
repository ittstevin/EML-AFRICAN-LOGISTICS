import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../context/authStore'
import { TextInput, Select } from '../../components/common/FormFields'
import Button from '../../components/common/Button'
import { AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'driver',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
    })

    if (result.success) {
      navigate('/login')
    }
  }

  const roleOptions = [
    { value: 'operator', label: 'Operator' },
    { value: 'driver', label: 'Driver' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 text-center">Create Account</h2>

      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle size={20} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <TextInput
        label="Full Name"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <TextInput
        label="Phone"
        name="phone"
        placeholder="Enter your phone number"
        value={formData.phone}
        onChange={handleChange}
      />

      <Select
        label="Role"
        name="role"
        options={roleOptions}
        value={formData.role}
        onChange={handleChange}
        required
      />

      <TextInput
        label="Password"
        name="password"
        type="password"
        placeholder="Enter a strong password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <TextInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      <Button fullWidth isLoading={isLoading} type="submit">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  )
}
