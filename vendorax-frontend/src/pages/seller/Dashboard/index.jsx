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
  <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <span className="text-white text-sm">{icon}</span>
      </div>
    </div>
    {loading
      ? <div className="h-8 w-20 bg-gray-100 rounded-lg animate-pulse" />
      : <p className="text-2xl font-bold text-gray-800 animate-count-up">{value}</p>
    }
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
          // Fetch real stats from analytics endpoint
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

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Welcome header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Welcome back, {user?.name}
            <span className="animate-float inline-block">👋</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's what's happening with your store today</p>
        </div>

        {/* Store status banner */}
        {!loading && !store && (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-lg">🏪</span>
              </div>
              <div>
                <p className="text-purple-800 font-semibold text-sm">Your store isn't set up yet</p>
                <p className="text-purple-500 text-xs mt-0.5">Create your store to start selling on VendoraX</p>
              </div>
            </div>
            <Link to="/seller/store/create"
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm px-5 py-2.5 rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 font-semibold">
              Create store
            </Link>
          </div>
        )}

        {!loading && store && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold">{store.storeName[0]}</span>
              </div>
              <div>
                <p className="text-emerald-800 font-semibold text-sm">{store.storeName}</p>
                <p className="text-emerald-500 text-xs mt-0.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  vendorax.app/store/{store.storeSlug}
                </p>
              </div>
            </div>
            <Link to={`/store/${store.storeSlug}`}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm px-5 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 font-semibold flex items-center gap-1">
              View store
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in-up animation-delay-200">
          {statCards.map((s, i) => (
            <div key={s.label} className="stagger-child" style={{ animationDelay: `${i * 100 + 200}ms` }}>
              <StatCard {...s} loading={statsLoading} />
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="animate-fade-in-up animation-delay-400">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link, i) => (
              <Link key={link.to} to={link.to}
                className="group bg-white rounded-2xl border border-gray-100 p-6 card-hover stagger-child flex items-start gap-4"
                style={{ animationDelay: `${i * 80 + 400}ms` }}>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center shadow-lg ${link.shadow} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-lg">{link.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-purple-700 transition-colors">{link.label}</p>
                  <p className="text-gray-400 text-xs mt-1">{link.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default SellerDashboard
