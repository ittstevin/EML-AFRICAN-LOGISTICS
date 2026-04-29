import { useEffect, useState } from 'react'
import { Trash2, Check } from 'lucide-react'
import Card, { CardHeader, CardBody } from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import { notificationsAPI } from '../../api/services'
import { formatTime, getRelativeTime } from '../../utils/helpers'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const response =
        filter === 'unread' ? await notificationsAPI.getUnread() : await notificationsAPI.getAll()
      setNotifications(response.data?.data || [])
    } catch (err) {
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      fetchNotifications()
    } catch (err) {
      toast.error('Failed to update notification')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      toast.success('All notifications marked as read')
      fetchNotifications()
    } catch (err) {
      toast.error('Failed to update notifications')
    }
  }

  const handleDelete = async (id) => {
    try {
      await notificationsAPI.delete(id)
      toast.success('Notification deleted')
      fetchNotifications()
    } catch (err) {
      toast.error('Failed to delete notification')
    }
  }

  if (isLoading) return <LoadingSpinner />

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with job and payment alerts</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id} className={!notification.isRead ? 'bg-blue-50 border-blue-200' : ''}>
              <CardBody className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.isRead && (
                      <Badge variant="info" size="sm">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notification.message}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">{getRelativeTime(notification.createdAt)}</span>
                    {notification.actionUrl && (
                      <a href={notification.actionUrl} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        View Details →
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications {filter !== 'all' ? 'in this category' : 'yet'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
