import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../../store/useAuthStore'
import { getMyStore } from '../../../api/store'
import api from '../../../api/axiosInstance'

// Animated counter hook
const useCountUp = (end, duration = 1000, start = true) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || end == null || isNaN(end)) return
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * Number(end)))
      if (progress < 1) window.requestAnimationFrame(step)
    }
    window.requestAnimationFrame(step)
  }, [end, duration, start])
  return count
}

// Quick links with enhanced styling
const quickLinks = [
  {
    label: 'Manage products', desc: 'Add, edit or remove products',
    to: '/seller/products', icon: '📦',
    gradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-300', hoverBorder: 'hover:border-violet-400',
    shadowColor: 'hover:shadow-violet-500/20',
  },
  {
    label: 'View orders', desc: 'Track and manage your orders',
    to: '/seller/orders', icon: '📋',
    gradient: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-300', hoverBorder: 'hover:border-emerald-400',
    shadowColor: 'hover:shadow-emerald-500/20',
  },
  {
    label: 'AI tools', desc: 'Generate descriptions and tags',
    to: '/seller/ai-tools', icon: '✨',
    gradient: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-300', hoverBorder: 'hover:border-amber-400',
    shadowColor: 'hover:shadow-amber-500/20',
  },
  {
    label: 'Analytics', desc: 'See your store performance',
    to: '/seller/analytics', icon: '📊',
    gradient: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-300', hoverBorder: 'hover:border-blue-400',
    shadowColor: 'hover:shadow-blue-500/20',
  },
]

// Stat card component with animated counter support
const StatCard = ({ label, value, icon, gradient, borderColor, hoverBorder, shadowColor, loading }) => {
  const animatedValue = useCountUp(value, 1000, !loading)
  return (
    <div className={`bg-white rounded-2xl border ${borderColor} ${hoverBorder} p-5 shadow-md hover:shadow-xl ${shadowColor} transition-all duration-500 hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300`}>
          <span className="text-white text-base">{icon}</span>
        </div>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-6 w-24 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-3 w-16 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      ) : (
        <div>
          <p className="text-2xl font-bold text-slate-800 tabular-nums">{value != null ? animatedValue : '—'}</p>
          <p className="text-xs text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Updated just now</p>
        </div>
      )}
    </div>
  )
}

const SellerDashboard = () => {
  const user = useAuthStore((s) => s.user)
  const [store, setStore] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    getMyStore()
      .then((res) => {
        const s = res.data.store
        setStore(s)
        if (s?._id) {
          api.get(`/analytics/store/${s._id}`)
            .then(r => setStats(r.data))
            .catch(() => setStats(null))
            .finally(() => setStatsLoading(false))
        } else {
          setStatsLoading(false)
        }
      })
      .catch(() => { setStore(null); setStatsLoading(false) })
      .finally(() => setLoading(false))
  }, [])

  const statCardsData = [
    { label: 'Total orders', value: stats?.totalOrders ?? null, icon: '📋', gradient: 'from-violet-500 to-purple-600',
      borderColor: 'border-violet-300', hoverBorder: 'hover:border-violet-400', shadowColor: 'hover:shadow-violet-500/20' },
    { label: 'Revenue', value: stats?.totalRevenue != null ? stats.totalRevenue : null, icon: '💰', gradient: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-300', hoverBorder: 'hover:border-emerald-400', shadowColor: 'hover:shadow-emerald-500/20' },
    { label: 'Products', value: stats?.totalProducts ?? null, icon: '📦', gradient: 'from-amber-500 to-orange-500',
      borderColor: 'border-amber-300', hoverBorder: 'hover:border-amber-400', shadowColor: 'hover:shadow-amber-500/20' },
    { label: 'Avg order value', value: stats?.avgOrderValue != null ? stats.avgOrderValue : null, icon: '📊', gradient: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-300', hoverBorder: 'hover:border-blue-400', shadowColor: 'hover:shadow-blue-500/20' },
  ]

  // Additional metrics from analytics
  const pendingOrders = stats?.orderStatus?.pending ?? 0
  const deliveredOrders = stats?.orderStatus?.delivered ?? 0
  const successRate = stats?.totalOrders ? Math.round((deliveredOrders / stats.totalOrders) * 100) : 0
  const totalRevenue = stats?.totalRevenue ?? 0

  // Sales target (static for visual)
  const salesTarget = 10000
  const revenueProgress = totalRevenue > 0 ? Math.min(100, Math.round((totalRevenue / salesTarget) * 100)) : 0

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100">
      {/* Enhanced background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl animate-float-bounce" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-purple-300/40 rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-indigo-300/40 rounded-full animate-pulse" style={{ animationDelay: '1.4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Premium Hero Dashboard Section */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/30 animate-soft-bounce">
                  <span className="text-white text-2xl">👋</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {getGreeting()}, {user?.name}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">{today}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-3 max-w-xl">
                Welcome back to your seller command center. Here's what's happening with your store today.
              </p>
            </div>
            {/* Store status badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${store ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {store ? '🟢 Store Active' : '🟡 Store Not Set Up'}
              </span>
              {store && <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">🏆 Seller Pro</span>}
            </div>
          </div>
        </div>

        {/* Store overview card (if store exists) */}
        {!loading && store && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border-2 border-emerald-300 p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scale-in shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white text-xl font-bold">{store.storeName[0]}</span>
              </div>
              <div>
                <p className="text-emerald-900 font-bold text-lg">{store.storeName}</p>
                <div className="flex items-center gap-2 text-emerald-600 text-sm mt-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="font-mono">vendorax.app/store/{store.storeSlug}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(`vendorax.app/store/${store.storeSlug}`)}
                    className="ml-2 text-emerald-500 hover:text-emerald-700 transition-colors p-1 rounded-md hover:bg-white/50"
                    title="Copy store URL"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <Link to={`/store/${store.storeSlug}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center gap-2">
              View store
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {!loading && !store && (
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-100 border border-purple-300 rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scale-in shadow-md hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-500">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 animate-float-bounce">
                <span className="text-white text-2xl">🏪</span>
              </div>
              <div>
                <p className="text-purple-900 font-bold text-lg">Let's get you selling!</p>
                <p className="text-purple-600 text-sm mt-0.5 max-w-md">
                  Create your store now and reach thousands of customers on VendoraX. It only takes two minutes.
                </p>
              </div>
            </div>
            <Link to="/seller/store/create"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:-translate-y-0.5 inline-flex items-center gap-2 group">
              <span>Create store</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        )}

        {/* Analytics Section */}
        {!statsLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in-up stagger-children">
            {statCardsData.map((s) => (
              <StatCard key={s.label} {...s} loading={false} />
            ))}
            {/* Additional metric cards using existing data */}
            <StatCard label="Pending orders" value={pendingOrders} icon="⏳" gradient="from-amber-500 to-orange-500" borderColor="border-amber-300" hoverBorder="hover:border-amber-400" shadowColor="hover:shadow-amber-500/20" loading={false} />
            <StatCard label="Delivered" value={deliveredOrders} icon="📦" gradient="from-emerald-500 to-teal-500" borderColor="border-emerald-300" hoverBorder="hover:border-emerald-400" shadowColor="hover:shadow-emerald-500/20" loading={false} />
            <StatCard label="Success rate" value={`${successRate}%`} icon="✅" gradient="from-blue-500 to-cyan-500" borderColor="border-blue-300" hoverBorder="hover:border-blue-400" shadowColor="hover:shadow-blue-500/20" loading={false} />
          </div>
        )}

        {/* Sales Performance Widget */}
        {!statsLoading && store && (
          <div className="mb-10 animate-fade-in-up animation-delay-200">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm">📈</span>
                Sales Performance
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Circular progress ring */}
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="url(#gradient)" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - revenueProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-700">{revenueProgress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly revenue target: <span className="font-semibold">₹{salesTarget.toLocaleString()}</span></p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Current revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Insights & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 animate-fade-in-up animation-delay-300">
          {/* Quick Actions (takes 2 columns on large) */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              Quick Actions
              <div className="h-px flex-1 bg-gray-200" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group bg-white rounded-2xl border ${link.borderColor} ${link.hoverBorder} p-5 shadow-md hover:shadow-xl ${link.shadowColor} transition-all duration-500 hover:-translate-y-1 flex items-center gap-4`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300`}>
                    <span className="text-white text-xl">{link.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors duration-300">{link.label}</p>
                    <p className="text-gray-400 text-xs mt-1 truncate">{link.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center transition-all duration-300 shrink-0">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Assistant Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-purple-200 p-5 shadow-lg sticky top-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">AI Assistant</p>
                  <p className="text-xs text-gray-400">Smart recommendations</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><span className="text-purple-500">•</span>Add product descriptions to boost SEO.</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">•</span>Offer free shipping on orders above ₹500.</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">•</span>Highlight best-selling items on your storefront.</li>
              </ul>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-700">✨ These tips can help increase your conversion rate by up to 20%.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline (static for visual richness) */}
        <div className="mb-10 animate-fade-in-up animation-delay-400">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            Recent Activity
            <div className="h-px flex-1 bg-gray-200" />
          </h2>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-6 shadow-lg space-y-4">
            {[
              { time: 'Today', text: 'New order received #1A2B3C4D – ₹2,499.00' },
              { time: 'Yesterday', text: 'Product "Handmade Chocolate Cake" stock updated to 42 units.' },
              { time: '3 days ago', text: 'Store description updated – now includes new shipping policies.' },
              { time: '1 week ago', text: 'Revenue milestone: crossed ₹5,000 in total sales!' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-2 h-2 rounded-full bg-purple-400"></div>
                <div>
                  <p className="text-xs text-gray-500">{item.time}</p>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard