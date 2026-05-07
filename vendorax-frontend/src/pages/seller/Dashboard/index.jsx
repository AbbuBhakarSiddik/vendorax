import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthStore from '../../../store/useAuthStore'
import { getMyStore } from '../../../api/store'
import api from '../../../api/axiosInstance'

const quickLinks = [
  { label: 'Manage products', desc: 'Add, edit or remove products', to: '/seller/products', color: 'border-purple-200 hover:border-purple-400' },
  { label: 'View orders', desc: 'Track and manage your orders', to: '/seller/orders', color: 'border-teal-200 hover:border-teal-400' },
  { label: 'AI tools', desc: 'Generate descriptions and tags', to: '/seller/ai-tools', color: 'border-amber-200 hover:border-amber-400' },
  { label: 'Analytics', desc: 'See your store performance', to: '/seller/analytics', color: 'border-blue-200 hover:border-blue-400' },
]

const StatCard = ({ label, value, color, loading }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-xs text-gray-500 mb-2">{label}</p>
    {loading
      ? <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
      : <p className={`text-2xl font-bold px-2 py-0.5 rounded-lg inline-block ${color}`}>{value}</p>
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
    {
      label: 'Total orders',
      value: stats?.totalOrders ?? '—',
      color: 'text-purple-700 bg-purple-50'
    },
    {
      label: 'Revenue',
      value: stats?.totalRevenue != null ? `₹${stats.totalRevenue.toLocaleString()}` : '—',
      color: 'text-teal-700 bg-teal-50'
    },
    {
      label: 'Products',
      value: stats?.totalProducts ?? '—',
      color: 'text-amber-700 bg-amber-50'
    },
    {
      label: 'Avg order value',
      value: stats?.avgOrderValue != null ? `₹${Math.round(stats.avgOrderValue).toLocaleString()}` : '—',
      color: 'text-blue-700 bg-blue-50'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today</p>
        </div>

        {/* Store status banner */}
        {!loading && !store && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="text-purple-800 font-medium text-sm">Your store isn't set up yet</p>
              <p className="text-purple-600 text-xs mt-0.5">Create your store to start selling on VendoraX</p>
            </div>
            <Link to="/seller/store/create"
              className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Create store
            </Link>
          </div>
        )}

        {!loading && store && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-8 flex items-center justify-between">
            <div>
              <p className="text-teal-800 font-medium text-sm">{store.storeName}</p>
              <p className="text-teal-600 text-xs mt-0.5">vendorax.app/store/{store.storeSlug}</p>
            </div>
            <Link to={`/store/${store.storeSlug}`}
              className="bg-teal-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-700 transition">
              View store →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} loading={statsLoading} />
          ))}
        </div>

        {/* Quick actions */}
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}
              className={`bg-white rounded-xl border-2 p-5 transition ${link.color}`}>
              <p className="font-semibold text-gray-800 text-sm">{link.label}</p>
              <p className="text-gray-500 text-xs mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}

export default SellerDashboard
