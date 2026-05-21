import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import useCartStore from '../../store/useCartStore'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useCartStore(s => s.getCount())
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/login')
  }

  // Don't show navbar on login/register
  const hideOn = ['/login', '/register']
  if (hideOn.includes(location.pathname)) return null

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl transition-all duration-300"
        style={{ boxShadow: '0 1px 20px rgba(124,58,237,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-sm tracking-tight">Vx</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                VendoraX
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-2">
              {!user ? (
                <>
                  <Link to="/login"
                    className="text-sm text-gray-600 hover:text-purple-600 px-4 py-2 rounded-xl hover:bg-purple-50/80 transition-all duration-200 font-medium">
                    Sign in
                  </Link>
                  <Link to="/register"
                    className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5">
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  {/* Seller nav */}
                  {user.role === 'seller' && (
                    <div className="flex items-center gap-1 mr-2">
                      {[
                        { to: '/seller/dashboard', label: 'Dashboard' },
                        { to: '/seller/products', label: 'Products' },
                        { to: '/seller/orders', label: 'Orders' },
                        { to: '/seller/analytics', label: 'Analytics' },
                        { to: '/seller/ai-tools', label: 'AI Tools' },
                      ].map(link => (
                        <Link key={link.to} to={link.to}
                          className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 font-medium ${location.pathname === link.to
                            ? 'text-purple-700 bg-purple-50'
                            : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
                            }`}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Admin nav */}
                  {user.role === 'admin' && (
                    <div className="flex items-center gap-1 mr-2">
                      {[
                        { to: '/admin/dashboard', label: 'Dashboard' },
                        { to: '/admin/stores', label: 'Stores' },
                        { to: '/admin/users', label: 'Users' },
                      ].map(link => (
                        <Link key={link.to} to={link.to}
                          className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 font-medium ${location.pathname === link.to
                            ? 'text-purple-700 bg-purple-50'
                            : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
                            }`}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Buyer nav */}
                  {user.role === 'buyer' && (
                    <div className="flex items-center gap-1 mr-2">
                      <Link to="/cart"
                        className={`relative text-sm px-3 py-2 rounded-lg transition-all duration-200 font-medium flex items-center gap-1.5 ${location.pathname === '/cart'
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
                          }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        Cart
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg shadow-purple-500/30 animate-scale-in">
                            {cartCount}
                          </span>
                        )}
                      </Link>
                      <Link to="/orders"
                        className={`text-sm px-3 py-2 rounded-lg transition-all duration-200 font-medium ${location.pathname === '/orders'
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50/60'
                          }`}>
                        Orders
                      </Link>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-px h-7 bg-gray-200/80 mx-1" />

                  {/* User menu */}
                  <Link to={user.role === 'buyer' ? '/profile' : '#'}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-shadow">
                      {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</span>
                      <span className="text-[10px] text-purple-500 font-medium capitalize leading-tight">{user.role}</span>
                    </div>
                  </Link>

                  <button onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50/80 transition-all duration-200 font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all">
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl animate-fade-in-up p-4 space-y-1"
            onClick={e => e.stopPropagation()}>

            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                  Sign in
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-center">
                  Get started
                </Link>
              </>
            ) : (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-xs text-purple-500 capitalize font-medium">{user.role}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-2">
                  {user.role === 'buyer' && (
                    <>
                      <Link to="/cart" onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                        <span>🛒 Cart</span>
                        {cartCount > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">{cartCount}</span>}
                      </Link>
                      <Link to="/orders" onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                        📦 Orders
                      </Link>
                      <Link to="/profile" onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                        👤 Profile
                      </Link>
                    </>
                  )}
                  {user.role === 'seller' && (
                    <>
                      {[
                        { to: '/seller/dashboard', icon: '📊', label: 'Dashboard' },
                        { to: '/seller/products', icon: '📦', label: 'Products' },
                        { to: '/seller/orders', icon: '📋', label: 'Orders' },
                        { to: '/seller/analytics', icon: '📈', label: 'Analytics' },
                        { to: '/seller/ai-tools', icon: '✨', label: 'AI Tools' },
                      ].map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                          {link.icon} {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                  {user.role === 'admin' && (
                    <>
                      {[
                        { to: '/admin/dashboard', icon: '🏠', label: 'Dashboard' },
                        { to: '/admin/stores', icon: '🏪', label: 'Stores' },
                        { to: '/admin/users', icon: '👥', label: 'Users' },
                      ].map(link => (
                        <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition">
                          {link.icon} {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-2 mt-2">
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition">
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar