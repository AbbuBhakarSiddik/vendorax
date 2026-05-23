import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../../store/useAuthStore'
import { getMyStore } from '../../../api/store'
import api from '../../../api/axiosInstance'

const quickLinks = [
  { label: 'Manage products', desc: 'Add, edit or remove products', to: '/seller/products', icon: '📦', gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-purple-500/20' },
  { label: 'View orders', desc: 'Track and manage your orders', to: '/seller/orders', icon: '📋', gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-teal-500/20' },
  { label: 'AI tools', desc: 'Generate descriptions and tags', to: '/seller/ai-tools', icon: '✨', gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
  { label: 'Analytics', desc: 'See your store performance', to: '/seller/analytics', icon: '📊', gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
]

const StatCard = ({ label, value, icon, gradient, loading }) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white text-base">{icon}</span>
      </div>
    </div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-6 w-24 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-3 w-16 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    ) : (
      <div>
        <p className="text-2xl font-bold text-gray-800 tabular-nums">{value}</p>
        <p className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Updated just now</p>
      </div>
    )}
  </div>
)

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

  const statCards = [
    { label: 'Total orders', value: stats?.totalOrders ?? '—', icon: '📋', gradient: 'from-violet-500 to-purple-600' },
    { label: 'Revenue', value: stats?.totalRevenue != null ? `₹${stats.totalRevenue.toLocaleString()}` : '—', icon: '💰', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Products', value: stats?.totalProducts ?? '—', icon: '📦', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Avg order value', value: stats?.avgOrderValue != null ? `₹${Math.round(stats.avgOrderValue).toLocaleString()}` : '—', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
  ]

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzI3QjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAgMS4zOC0xLjEyIDIuNS0yLjUgMi41UzMxIDE5LjM4IDMxIDE4czEuMTItMi41IDIuNS0yLjVTIDM2IDE2LjYyIDM2IDE4em0tMTAgMGMwIDEuMzgtMS4xMiAyLjUtMi41IDIuNVMyMSAxOS4zOCAyMSAxOHMxLjEyLTIuNSAyLjUtMi41UzI2IDE2LjYyIDI2IDE4em0xMCAzMGMwIDEuMzgtMS4xMiAyLjUtMi41IDIuNVMzMSA0OS4zOCAzMSA0OHMxLjEyLTIuNSAyLjUtMi41UzM2IDQ2LjYyIDM2IDQ4em0tMTAgMGMwIDEuMzgtMS4xMiAyLjUtMi41IDIuNVMyMSA0OS4zOCAyMSA0OHMxLjEyLTIuNSAyLjUtMi41UzI2IDQ2LjYyIDI2IDQ4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Welcome header with dynamic greeting */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {getGreeting()}, {user?.name}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Here's a quick overview of your store
              </p>
            </div>
          </div>
        </div>

        {/* Store status banner – improved with more visuals */}
        {!loading && !store && (
          <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-100 border border-purple-200/60 rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scale-in shadow-sm">
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

        {!loading && store && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-200/60 rounded-3xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scale-in shadow-sm">
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
                    onClick={() => {
                      navigator.clipboard.writeText(`vendorax.app/store/${store.storeSlug}`)
                    }}
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

        {/* Loading skeleton for stats */}
        {statsLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in-up">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-8 w-8 rounded-xl bg-gray-100 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actual stats */}
        {!statsLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in-up stagger-children">
            {statCards.map((s) => (
              <StatCard key={s.label} {...s} loading={false} />
            ))}
          </div>
        )}

        {/* Quick actions – enhanced with hover effects and layout */}
        <div className="animate-fade-in-up animation-delay-400">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            Quick Actions
            <div className="h-px flex-1 bg-gray-200" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.gradient} flex items-center justify-center shadow-md ${link.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-xl">{link.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">{link.label}</p>
                  <p className="text-gray-400 text-xs mt-1 truncate">{link.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Loading skeleton for quick links */}
        {loading && (
          <div className="animate-fade-in-up animation-delay-400">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/90 rounded-2xl border border-white/50 p-5 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-50 rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerDashboard