import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { getStoreAnalytics } from '../../../api/analytics'

const StatCard = ({ label, value, sub, icon, gradient }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 card-hover">
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <span className="text-white text-sm">{icon}</span>
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
)

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

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 rounded-lg w-1/2 mb-3" />
              <div className="h-8 bg-gray-100 rounded-lg w-2/3" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-72" />
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-red-500 text-sm font-medium">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
              <p className="text-gray-400 text-sm">Your store performance overview</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-100">
          <StatCard label="Total revenue" value={`₹${data.totalRevenue.toLocaleString()}`}
            sub="From paid orders" icon="💰" gradient="from-violet-500 to-purple-600" />
          <StatCard label="Total orders" value={data.totalOrders}
            sub={`${data.orderStatus.delivered} delivered`} icon="📋" gradient="from-blue-500 to-cyan-500" />
          <StatCard label="Total products" value={data.totalProducts}
            sub="In your store" icon="📦" gradient="from-emerald-500 to-teal-500" />
          <StatCard label="Cancelled" value={data.orderStatus.cancelled}
            sub={`${data.orderStatus.pending} pending`} icon="⚠️" gradient="from-amber-500 to-orange-500" />
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-xl shadow-purple-500/[0.03] animate-fade-in-up animation-delay-200">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Revenue — last 7 days
          </h2>
          {data.last7Days.every(d => d.revenue === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={v => `₹${v}`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }} />
                <Line type="monotone" dataKey="revenue"
                  stroke="#7c3aed" strokeWidth={2.5}
                  dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">

          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03]">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              Order Status
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Pending', key: 'pending', color: 'bg-amber-400' },
                { label: 'Confirmed', key: 'confirmed', color: 'bg-blue-400' },
                { label: 'Shipped', key: 'shipped', color: 'bg-purple-400' },
                { label: 'Delivered', key: 'delivered', color: 'bg-emerald-400' },
                { label: 'Cancelled', key: 'cancelled', color: 'bg-red-400' },
              ].map(({ label, key, color }) => {
                const count = data.orderStatus[key]
                const pct = data.totalOrders > 0 ? Math.round((count / data.totalOrders) * 100) : 0
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                      <span className="font-medium">{label}</span>
                      <span className="font-semibold">{count} <span className="text-gray-400">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`${color} h-2.5 rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03]">
            <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Top Selling Products
            </h2>
            {data.topProducts.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No sales data yet</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.topProducts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis dataKey="name" type="category"
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      width={90} />
                    <Tooltip
                      formatter={(value) => [value, 'Units sold']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }} />
                    <Bar dataKey="qty" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-5 space-y-2.5">
                  {data.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-violet-100 to-purple-50 text-purple-700 rounded-full flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="text-gray-700 font-medium line-clamp-1">{p.name}</span>
                      </div>
                      <span className="text-gray-400 shrink-0 ml-2">
                        {p.qty} sold · <span className="text-gray-600 font-semibold">₹{p.revenue.toLocaleString()}</span>
                      </span>
                    </div>
                  ))}
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