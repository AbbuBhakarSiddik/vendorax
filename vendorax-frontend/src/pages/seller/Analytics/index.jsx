import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { getStoreAnalytics } from '../../../api/analytics'

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color || 'text-gray-800'}`}>{value}</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse h-64" />
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Your store performance overview</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total revenue"
            value={`₹${data.totalRevenue.toLocaleString()}`}
            sub="From paid orders"
            color="text-purple-700"
          />
          <StatCard
            label="Total orders"
            value={data.totalOrders}
            sub={`${data.orderStatus.delivered} delivered`}
          />
          <StatCard
            label="Total products"
            value={data.totalProducts}
            sub="In your store"
            color="text-teal-700"
          />
          <StatCard
            label="Cancelled orders"
            value={data.orderStatus.cancelled}
            sub={`${data.orderStatus.pending} pending`}
            color="text-amber-600"
          />
        </div>

        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-6">Revenue — last 7 days</h2>
          {data.last7Days.every(d => d.revenue === 0) ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={v => `₹${v}`} />
                <Tooltip
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '12px'
                  }} />
                <Line type="monotone" dataKey="revenue"
                  stroke="#7c3aed" strokeWidth={2.5}
                  dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">Order status</h2>
            <div className="space-y-3">
              {[
                { label: 'Pending', key: 'pending', color: 'bg-amber-400' },
                { label: 'Confirmed', key: 'confirmed', color: 'bg-blue-400' },
                { label: 'Shipped', key: 'shipped', color: 'bg-purple-400' },
                { label: 'Delivered', key: 'delivered', color: 'bg-teal-400' },
                { label: 'Cancelled', key: 'cancelled', color: 'bg-red-400' },
              ].map(({ label, key, color }) => {
                const count = data.orderStatus[key]
                const pct = data.totalOrders > 0
                  ? Math.round((count / data.totalOrders) * 100)
                  : 0
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{label}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">Top selling products</h2>
            {data.topProducts.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-400 text-sm">No sales data yet</p>
              </div>
            ) : (
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
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '12px'
                    }} />
                  <Bar dataKey="qty" fill="#7c3aed" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {data.topProducts.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.topProducts.map((p, i) => (
                  <div key={p.name}
                    className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 line-clamp-1">{p.name}</span>
                    </div>
                    <span className="text-gray-500 shrink-0 ml-2">
                      {p.qty} sold · ₹{p.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default SellerAnalytics