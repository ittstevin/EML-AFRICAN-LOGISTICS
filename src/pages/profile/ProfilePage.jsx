import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import { TextInput, Checkbox } from '../../components/common/FormFields'
import { useAuthStore } from '../../context/authStore'
import { userAPI } from '../../api/services'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">{formData.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">{formData.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 font-medium">{formData.phone || 'Not provided'}</div>
                </div>

                <p className="text-sm text-gray-500 mt-4">Profile updates coming soon</p>
              </div>
            </CardBody>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="relative">
                  <TextInput
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="relative">
                  <TextInput
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="relative">
                  <TextInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <Checkbox
                  label="Show password"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />

                <Button type="submit" fullWidth>
                  Update Password
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Avatar/Info */}
          <Card>
            <CardBody className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white text-4xl mx-auto">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
              </div>
            </CardBody>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Account Status</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase">Account Type</p>
                <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Email Verified</p>
                <p className="font-semibold text-green-600">✓ Verified</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase">Two-Factor Auth</p>
                <p className="font-semibold text-gray-900">Disabled</p>
              </div>
            </CardBody>
          </Card>

          {/* Security Tips */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold text-gray-900">Security Tips</h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Use a strong, unique password</li>
                <li>✓ Change password regularly</li>
                <li>✓ Never share your credentials</li>
                <li>✓ Log out when using shared devices</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
