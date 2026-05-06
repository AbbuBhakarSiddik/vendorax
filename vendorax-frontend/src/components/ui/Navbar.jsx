import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'
import useNotificationStore from '../../store/useNotificationStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const cartCount = useCartStore(s => s.getCount())
  const { notifications, markAllRead, clearAll, getUnreadCount } = useNotificationStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = getUnreadCount()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBellClick = () => {
    setShowNotifs(!showNotifs)
    if (!showNotifs) markAllRead()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-purple-600">VendoraX</Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login"
              className="text-sm text-gray-600 hover:text-purple-600">
              Sign in
            </Link>
            <Link to="/register"
              className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Get started
            </Link>
          </>
        ) : (
          <>
            {/* Role based links */}
            {user.role === 'seller' && (
              <div className="flex items-center gap-4">
                <Link to="/seller/dashboard"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Dashboard
                </Link>
                <Link to="/seller/products"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Products
                </Link>
                <Link to="/seller/orders"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Orders
                </Link>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="flex items-center gap-4">
                <Link to="/admin/dashboard"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Dashboard
                </Link>
                <Link to="/admin/stores"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Stores
                </Link>
                <Link to="/admin/users"
                  className="text-sm text-gray-600 hover:text-purple-600">
                  Users
                </Link>
              </div>
            )}

            {user.role === 'buyer' && (
              <Link to="/cart"
                className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                Cart
                {cartCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notification bell */}
            <div className="relative">
              <button onClick={handleBellClick}
                className="relative text-gray-600 hover:text-purple-600 transition p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifs && (
                <div className="absolute right-0 top-9 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">Notifications</p>
                    {notifications.length > 0 && (
                      <button onClick={clearAll}
                        className="text-xs text-gray-400 hover:text-red-500">
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-gray-400 text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id}
                          className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!notif.read ? 'bg-purple-50' : ''
                            }`}>
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.type === 'success' ? 'bg-teal-500'
                              : notif.type === 'warning' ? 'bg-amber-500'
                                : 'bg-purple-500'
                              }`} />
                            <div>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(notif.time).toLocaleTimeString('en-IN', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">{user.name}</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                {user.role}
              </span>
              <button onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 font-medium">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar