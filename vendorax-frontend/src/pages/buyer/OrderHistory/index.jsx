import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosInstance'

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', gradient: 'from-amber-400 to-amber-500' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400', gradient: 'from-blue-400 to-blue-500' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400', gradient: 'from-purple-400 to-purple-500' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400', gradient: 'from-emerald-400 to-teal-400' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400', gradient: 'from-red-400 to-red-500' },
}

const STATUS_ICONS = {
  pending: '⏳',
  confirmed: '✅',
  shipped: '🚚',
  delivered: '📦',
  cancelled: '❌',
}

const ORDER_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/buyer')
      setOrders(res.data.orders)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await api.put(`/orders/${orderId}/cancel`)
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  const totalOrders = orders.length
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)).length
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const filteredOrders = useMemo(() => {
    let result = orders
    if (filter !== 'all') result = result.filter(o => o.orderStatus === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(o => {
        const idMatch = o._id?.toLowerCase().includes(q)
        const productMatch = o.products?.some(p => p.name?.toLowerCase().includes(q))
        const storeMatch = o.storeId?.storeName?.toLowerCase().includes(q)
        return idMatch || productMatch || storeMatch
      })
    }
    return result
  }, [orders, filter, search])

  const statusCounts = useMemo(() => {
    const counts = { all: orders.length }
    for (const s of ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']) {
      counts[s] = orders.filter(o => o.orderStatus === s).length
    }
    return counts
  }, [orders])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl border-2 border-white/50 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                <div className="h-5 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="h-3 bg-gray-200 rounded-lg w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
        <span className="absolute top-1/4 left-[10%] text-5xl opacity-10 animate-float-bounce">📦</span>
        <span className="absolute bottom-1/3 right-[10%] text-4xl opacity-10 animate-float-bounce" style={{ animationDelay: '1s' }}>🛒</span>
      </div>
      <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center shadow-xl shadow-purple-500/10">
          <span className="text-6xl">📦</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">No orders yet</h2>
        <p className="text-gray-500 text-lg mb-2">Start shopping to see your orders here.</p>
        <p className="text-gray-400 text-sm mb-10">Track, manage and review all your purchases.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          Browse marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/50 to-white">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl animate-float-bounce" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
        <span className="absolute top-1/4 right-[10%] text-4xl opacity-10 animate-float-bounce">📦</span>
        <span className="absolute bottom-1/3 left-[10%] text-3xl opacity-10 animate-float-bounce" style={{ animationDelay: '1s' }}>🏷️</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Premium Hero Section */}
        <div className="mb-10 animate-fade-in-up">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-violet-200/60 p-6 shadow-xl shadow-purple-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-500 text-sm mt-1">Track, manage and review all your purchases.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-purple-100/80 text-purple-700 text-xs font-semibold border border-purple-200">
                  📦 {totalOrders} orders
                </span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  ✅ {deliveredOrders} delivered
                </span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: totalOrders, icon: '📦', gradient: 'from-violet-500 to-purple-600', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200' },
                { label: 'Active Orders', value: activeOrders, icon: '🚚', gradient: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200' },
                { label: 'Delivered', value: deliveredOrders, icon: '✅', gradient: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200' },
                { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: '💰', gradient: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50', border: 'border-amber-200' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.bg} border-2 ${stat.border} rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{stat.label}</span>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow group-hover:scale-110 transition-transform`}>
                      <span className="text-white text-sm">{stat.icon}</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 animate-fade-in-up animation-delay-100 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by order ID, product or store..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 bg-white/80 backdrop-blur-sm text-sm transition-all"
            />
          </div>
          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                  filter === status
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                    : 'bg-white/60 backdrop-blur-sm text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                } flex items-center gap-1`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${filter === status ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Order list */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-violet-200/60 p-16 text-center animate-scale-in shadow-lg">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shadow-inner">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-600 font-bold text-lg mb-1">No orders found</p>
            <p className="text-gray-400 text-sm">
              {search ? 'Try a different search term.' : `No ${filter} orders at the moment.`}
            </p>
            {(filter !== 'all' || search) && (
              <button onClick={() => { setFilter('all'); setSearch('') }} className="mt-4 text-violet-600 text-sm underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, i) => {
              const statusStyle = STATUS_COLORS[order.orderStatus]
              const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus)
              return (
                <div key={order._id}
                  className={`relative bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 hover:border-violet-300 p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 stagger-child group overflow-hidden`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Colored left accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusStyle.dot}`} />
                  
                  {/* Gradient top accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusStyle.gradient}`} />

                  <div className="pl-2">
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-gray-800">
                            Order <span className="text-gray-400 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                          </span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} border-${statusStyle.border} shadow-sm group-hover:shadow-md transition-shadow`}>
                            {STATUS_ICONS[order.orderStatus]} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Store info */}
                    {order.storeId && (
                      <Link to={`/store/${order.storeId.storeSlug}`}
                        className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center text-xs font-bold text-purple-600">
                          {order.storeId.storeName[0]}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{order.storeId.storeName}</span>
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    )}

                    {/* Order timeline */}
                    {order.orderStatus !== 'cancelled' && (
                      <div className="mb-4 mt-2">
                        <div className="flex items-center gap-1">
                          {ORDER_STEPS.map((step, idx) => {
                            const isCompleted = idx < currentStepIndex
                            const isCurrent = idx === currentStepIndex
                            let circleClass = 'w-3 h-3 rounded-full border-2 '
                            if (isCompleted) circleClass += 'bg-emerald-500 border-emerald-500'
                            else if (isCurrent) circleClass += `${statusStyle.dot} border-${statusStyle.dot} animate-pulse`
                            else circleClass += 'bg-transparent border-gray-300'
                            return (
                              <div key={step} className="flex items-center flex-1 last:flex-none">
                                <div className={circleClass} />
                                {idx < ORDER_STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex justify-between mt-1 px-1">
                          {ORDER_STEPS.map(step => (
                            <span key={step} className={`text-[10px] ${currentStepIndex >= ORDER_STEPS.indexOf(step) ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.orderStatus === 'cancelled' && (
                      <div className="mb-3 mt-2 flex items-center gap-2 text-xs text-red-500">
                        <span className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                        Order Cancelled
                      </div>
                    )}

                    {/* Product thumbnails */}
                    <div className="flex gap-2 mb-4 overflow-x-auto py-1">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 shrink-0 hover:bg-white hover:shadow-sm transition">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-xs font-bold text-purple-600">
                            {p.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700 line-clamp-1 max-w-[120px]">{p.name}</p>
                            <span className="text-[10px] text-gray-400">×{p.qty} · ₹{p.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                      {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                        <button
                          onClick={() => handleCancel(order._id)}
                          disabled={cancelling === order._id}
                          className="text-xs bg-gradient-to-r from-red-400 to-rose-400 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-500/20 transition-all disabled:opacity-50 flex items-center gap-1 font-semibold"
                        >
                          {cancelling === order._id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Cancel order
                            </>
                          )}
                        </button>
                      )}
                      {order.orderStatus === 'delivered' && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Delivered
                        </span>
                      )}
                      {order.orderStatus === 'cancelled' && (
                        <span className="text-xs text-gray-400 font-medium">Order cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory