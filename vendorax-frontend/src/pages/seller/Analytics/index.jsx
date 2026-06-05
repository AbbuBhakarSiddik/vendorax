import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { getStoreAnalytics } from '../../../api/analytics'

// ----------------------------------------------------------------
// Custom CSS Animations
// ----------------------------------------------------------------
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  @keyframes floatSlow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 0 15px rgba(139, 92, 246, 0.2); }
    50% { border-color: rgba(139, 92, 246, 0.8); box-shadow: 0 0 30px rgba(139, 92, 246, 0.4); }
  }
  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes softBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes progressFill {
    from { width: 0%; }
  }
  @keyframes particleMove {
    0% { transform: translate(0, 0) scale(1); opacity: 0.6; }
    25% { transform: translate(30px, -30px) scale(1.2); opacity: 0.4; }
    50% { transform: translate(60px, 10px) scale(0.9); opacity: 0.7; }
    75% { transform: translate(20px, 40px) scale(1.1); opacity: 0.3; }
    100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
  .animate-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; }
  .animate-glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
  .animate-border-glow { animation: borderGlow 3s ease-in-out infinite; }
  .animate-slide-up-fade { animation: slideUpFade 0.6s ease-out forwards; }
  .animate-soft-bounce { animation: softBounce 2s ease-in-out infinite; }
  .animate-progress-fill { animation: progressFill 1.5s ease-out forwards; }
  .animate-particle { animation: particleMove 12s linear infinite; }
  .bg-gradient-mesh {
    background: radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%);
  }
`

// ----------------------------------------------------------------
// Premium Stat Card with animated light sweep
// ----------------------------------------------------------------
const StatCard = ({ label, value, sub, icon, gradient }) => {
  return (
    <div className="relative bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-5 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
      {/* Gradient top border */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient}`} />
      {/* Animated light sweep on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="text-white text-base">{icon}</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800 tabular-nums">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        <p className="text-xs text-purple-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Updated just now</p>
      </div>
    </div>
  )
}

const SellerAnalytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStoreAnalytics()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false))
  }, [])

  // ----------------------------------------------------------------
  // Loading Skeleton (enhanced)
  // ----------------------------------------------------------------
  if (loading) return (
    <div className="min-h-screen bg-gradient-mesh relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-6 animate-pulse h-72" />
      </div>
    </div>
  )

  // ----------------------------------------------------------------
  // Error State (enhanced)
  // ----------------------------------------------------------------
  if (error) return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center relative overflow-hidden">
      <style>{animationStyles}</style>
      <div className="text-center animate-slide-up-fade bg-white/90 backdrop-blur-lg rounded-3xl border-2 border-red-200 p-8 shadow-xl">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center animate-soft-bounce">
          <span className="text-4xl">📊</span>
        </div>
        <p className="text-red-500 text-lg font-bold mb-2">{error}</p>
        <p className="text-gray-400 text-sm">We couldn't load your analytics. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  )

  // ----------------------------------------------------------------
  // Main Dashboard
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-mesh">
      <style>{animationStyles}</style>

      {/* Ambient floating blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M36 34c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm-0 0c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        {/* Floating analytics-inspired particles (CSS dots) */}
        <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-purple-500/30 rounded-full animate-particle" />
        <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-blue-500/30 rounded-full animate-particle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-[20%] w-2 h-2 bg-cyan-500/30 rounded-full animate-particle" style={{ animationDelay: '4s' }} />
        <div className="absolute top-2/3 right-[10%] w-2.5 h-2.5 bg-indigo-500/30 rounded-full animate-particle" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/3 left-[40%] w-1.5 h-1.5 bg-violet-500/30 rounded-full animate-particle" style={{ animationDelay: '8s' }} />

        {/* Decorative chart line */}
        <svg className="absolute bottom-10 left-0 w-full h-40 opacity-5" viewBox="0 0 1200 200" preserveAspectRatio="none">
          <path d="M0,100 C200,20 400,180 600,100 C800,20 1000,180 1200,100" stroke="#8b5cf6" strokeWidth="4" fill="none" strokeDasharray="10,10" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* ---------------------------------------------------------- */}
        {/* Premium Header */}
        {/* ---------------------------------------------------------- */}
        <div className="mb-10 animate-slide-up-fade">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/25 animate-soft-bounce">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent bg-300% animate-gradient-shift">
                Analytics
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-purple-100/90 backdrop-blur border border-purple-200 text-purple-700 text-xs font-semibold animate-glow-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Live Analytics
                </span>
                <p className="text-gray-500 text-sm">Your store performance overview</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Stat Cards */}
        {/* ---------------------------------------------------------- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" style={{ animation: 'slideUpFade 0.6s ease-out forwards', animationDelay: '100ms' }}>
          <StatCard label="Total revenue" value={`₹${data.totalRevenue.toLocaleString()}`}
            sub="From paid orders" icon="💰" gradient="from-violet-500 to-purple-600" />
          <StatCard label="Total orders" value={data.totalOrders}
            sub={`${data.orderStatus.delivered} delivered`} icon="📋" gradient="from-blue-500 to-cyan-500" />
          <StatCard label="Total products" value={data.totalProducts}
            sub="In your store" icon="📦" gradient="from-emerald-500 to-teal-500" />
          <StatCard label="Cancelled" value={data.orderStatus.cancelled}
            sub={`${data.orderStatus.pending} pending`} icon="⚠️" gradient="from-amber-500 to-orange-500" />
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Revenue Chart – with glassmorphism and animated border */}
        {/* ---------------------------------------------------------- */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-gray-200 hover:border-purple-400 p-6 mb-6 shadow-xl shadow-purple-500/[0.05] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 group animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-800 text-lg">Revenue — last 7 days</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                LIVE DATA
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">Daily breakdown</span>
            </div>
          </div>
          {data.last7Days.every(d => d.revenue === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }}
                  tickFormatter={v => `₹${v}`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    fontSize: '12px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                  }} />
                <Line type="monotone" dataKey="revenue"
                  stroke="#8b5cf6" strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Order Status & Top Products Grid */}
        {/* ---------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ animation: 'slideUpFade 0.6s ease-out forwards', animationDelay: '300ms' }}>

          {/* Order Status Breakdown */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-gray-200 hover:border-blue-400 p-6 shadow-xl shadow-blue-500/[0.05] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-800 text-lg">Order Status</h2>
            </div>
            <div className="space-y-5">
              {[
                { label: 'Pending', key: 'pending', icon: '⏳', colorFrom: 'from-amber-400', colorTo: 'to-amber-500' },
                { label: 'Confirmed', key: 'confirmed', icon: '✅', colorFrom: 'from-blue-400', colorTo: 'to-blue-500' },
                { label: 'Shipped', key: 'shipped', icon: '🚚', colorFrom: 'from-purple-400', colorTo: 'to-purple-500' },
                { label: 'Delivered', key: 'delivered', icon: '📦', colorFrom: 'from-emerald-400', colorTo: 'to-emerald-500' },
                { label: 'Cancelled', key: 'cancelled', icon: '❌', colorFrom: 'from-red-400', colorTo: 'to-red-500' },
              ].map(({ label, key, icon, colorFrom, colorTo }) => {
                const count = data.orderStatus[key]
                const pct = data.totalOrders > 0 ? Math.round((count / data.totalOrders) * 100) : 0
                return (
                  <div key={key} className="group/progress">
                    <div className="flex justify-between text-sm text-gray-700 mb-1.5">
                      <span className="font-medium flex items-center gap-1.5">
                        <span>{icon}</span> {label}
                      </span>
                      <span className="font-semibold">{count} <span className="text-gray-400 text-xs">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${colorFrom} ${colorTo} transition-all duration-1000 ease-out group-hover/progress:brightness-110`}
                        style={{ width: `${pct}%`, animation: `progressFill 1.5s ease-out forwards` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-gray-200 hover:border-emerald-400 p-6 shadow-xl shadow-emerald-500/[0.05] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 group">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h2 className="font-bold text-gray-800 text-lg">Top Selling Products</h2>
            </div>
            {data.topProducts.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No sales data yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={data.topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis dataKey="name" type="category"
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      width={90} />
                    <Tooltip
                      formatter={(value) => [value, 'Units sold']}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        fontSize: '12px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)'
                      }} />
                    <Bar dataKey="qty" fill="#10b981" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-5 space-y-2.5">
                  {data.topProducts.map((p, i) => {
                    const medals = ['🥇', '🥈', '🥉']
                    return (
                      <div key={p.name} className="flex items-center justify-between text-sm group hover:bg-gray-50/80 backdrop-blur p-2 rounded-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-md shadow-amber-500/20' :
                            i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md shadow-gray-400/20' :
                            i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-md shadow-orange-500/20' :
                            'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>
                            {i <= 2 ? medals[i] : i + 1}
                          </span>
                          <span className="text-gray-700 font-medium line-clamp-1">{p.name}</span>
                        </div>
                        <span className="text-gray-400 shrink-0 ml-2 text-xs">
                          {p.qty} sold · <span className="text-gray-600 font-semibold">₹{p.revenue.toLocaleString()}</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default SellerAnalytics