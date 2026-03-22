import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const cartCount = useCartStore(s => s.getCount())

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-purple-600">VendoraX</Link>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-purple-600">Sign in</Link>
            <Link to="/register" className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Get started
            </Link>
          </>
        ) : (
          <>
            {user.role === 'seller' && (
              <Link to="/seller/dashboard" className="text-sm text-gray-600 hover:text-purple-600">
                Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-purple-600">
                Admin
              </Link>
            )}
            {user.role === 'buyer' && (
              <Link to="/cart" className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1">
                Cart
                {cartCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
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