import { useEffect, useState } from 'react'
import api from '../../../api/axiosInstance'
import { getMyStore } from '../../../api/store'

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', glow: 'shadow-amber-500/20' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400', glow: 'shadow-blue-500/20' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400', glow: 'shadow-purple-500/20' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400', glow: 'shadow-emerald-500/20' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400', glow: 'shadow-red-500/20' }
}

const STATUS_ICONS = {
  pending: '⏳',
  confirmed: '✅',
  shipped: '🚚',
  delivered: '📦',
  cancelled: '❌'
}

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered'
}

const ORDER_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

const SellerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)

  const fetchOrders = async () => {
    try {
      const storeRes = await getMyStore()
      const ordersRes = await api.get(`/orders/store/${storeRes.data.store._id}`)
      setOrders(ordersRes.data.orders)
    } catch {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus })
      fetchOrders()
    } catch {
      setError('Failed to update order status')
    } finally {
      setUpdating(null)
      setConfirmAction(null)
    }
  }

  const promptStatusUpdate = (orderId, newStatus) => {
    setConfirmAction({ orderId, newStatus })
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
  }

  // Computed insights
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const successRate = orders.length > 0 ? Math.round((statusCounts.delivered / orders.length) * 100) : 0

  const filterGradientMap = {
    all: 'from-violet-600 to-purple-600',
    pending: 'from-amber-500 to-orange-500',
    confirmed: 'from-blue-500 to-blue-600',
    shipped: 'from-purple-500 to-purple-600',
    delivered: 'from-emerald-500 to-teal-500',
    cancelled: 'from-red-500 to-red-600'
  }

  const copyOrderId = (id) => navigator.clipboard.writeText(id)

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div>
              <div className="h-6 w-24 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white/80 rounded-2xl border border-gray-200 p-4 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white/80 rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded-full w-20" />
              </div>
              <div className="h-16 bg-gray-100 rounded-xl mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-purple-50/30 flex items-center justify-center">
      <div className="text-center bg-white rounded-3xl border border-red-200 p-8 shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-3xl">📋</span>
        </div>
        <p className="text-red-500 text-sm font-medium">{error}</p>
        <button onClick={fetchOrders} className="mt-4 text-purple-600 text-sm underline">Retry</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-purple-50/30">
      {/* Enhanced background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/3 text-4xl opacity-5 animate-float-bounce">📦</div>
        <div className="absolute bottom-1/3 right-1/4 text-3xl opacity-5 animate-float-bounce" style={{ animationDelay: '1.5s' }}>🏷️</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Premium Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Orders Dashboard</h1>
                <p className="text-gray-500 text-sm">Manage and track your orders in real time</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_COLORS).map(([status, colors]) => {
                if (status === 'cancelled' && statusCounts.cancelled === 0) return null
                return (
                  <div key={status} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} border-${colors.border} shadow-sm flex items-center gap-1`}>
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    {status.charAt(0).toUpperCase() + status.slice(1)} {statusCounts[status]}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-100">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📋', gradient: 'from-violet-500 to-purple-600' },
            { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: '💰', gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Pending', value: statusCounts.pending, icon: '⏳', gradient: 'from-amber-500 to-orange-500' },
            { label: 'Success Rate', value: `${successRate}%`, icon: '✅', gradient: 'from-blue-500 to-cyan-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 p-4 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow`}>
                  <span className="text-white text-sm">{stat.icon}</span>
                </div>
              </div>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-scale-in">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
            <button onClick={fetchOrders} className="text-red-600 underline text-xs ml-2">Retry</button>
          </div>
        )}

        {/* Premium Filter Tabs Container */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-gray-200 p-1.5 flex overflow-x-auto no-scrollbar">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`flex-1 min-w-[80px] py-3 px-4 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center justify-center gap-1.5 ${
                  filter === status
                    ? `bg-gradient-to-r ${filterGradientMap[status]} text-white border-transparent shadow-lg`
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${filter === status ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Order List + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Order List (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-200 p-16 text-center shadow-lg">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                  <span className="text-4xl">📋</span>
                </div>
                <p className="text-gray-600 font-bold text-lg mb-1">No orders found</p>
                <p className="text-gray-400 text-sm">
                  {filter === 'all' ? 'Orders will appear here once buyers start purchasing' : `No ${filter} orders at the moment`}
                </p>
              </div>
            ) : (
              filtered.map((order, i) => {
                const statusStyle = STATUS_COLORS[order.orderStatus]
                const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus)
                return (
                  <div key={order._id}
                    className={`bg-white rounded-2xl border-2 ${statusStyle.border} p-5 sm:p-6 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 shadow-sm stagger-child relative overflow-hidden group`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Colored left accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusStyle.dot} rounded-r-full`} />

                    <div className="pl-2">
                      {/* Order header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-gray-800">
                                Order <span className="text-gray-400 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                              </span>
                              <button
                                onClick={() => copyOrderId(order._id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                title="Copy order ID"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} shadow-sm`}>
                              {STATUS_ICONS[order.orderStatus]} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Status timeline */}
                      {order.orderStatus !== 'cancelled' ? (
                        <div className="mb-5 mt-2">
                          <div className="flex items-center">
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
                                    <div className={`flex-1 h-0.5 mx-1 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
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
                      ) : (
                        <div className="mb-4 mt-2">
                          <div className="flex items-center gap-2 text-red-500 text-xs">
                            <span className="w-3 h-3 rounded-full bg-red-400" />
                            Order Cancelled
                          </div>
                        </div>
                      )}

                      {/* Buyer & Shipping Info */}
                      {order.buyerId && (
                        <div className="bg-gray-50/80 rounded-xl p-4 mb-4 border border-gray-100">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-600 shadow-sm">
                                  {order.buyerId.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">{order.buyerId.name}</p>
                                  <p className="text-xs text-gray-400">{order.buyerId.email}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              {order.shippingAddress && (
                                <>
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping Address</p>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    <p className="flex items-center gap-1">
                                      <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      {order.shippingAddress.address}
                                    </p>
                                    <p>{order.shippingAddress.city} — {order.shippingAddress.pincode}</p>
                                    {order.shippingAddress.phone && (
                                      <p className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {order.shippingAddress.phone}
                                      </p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Products */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Products</p>
                        <div className="space-y-2">
                          {order.products.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg p-2 border border-gray-100 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-50 flex items-center justify-center text-purple-600 text-xs font-bold">
                                  {p.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-800">{p.name}</span>
                                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 ml-2">x{p.qty}</span>
                                </div>
                              </div>
                              <span className="font-bold text-gray-800">₹{(p.price * p.qty).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border border-amber-200'
                          }`}>
                            {order.paymentStatus === 'paid' ? '💳 Paid' : '⏳ Pending'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {NEXT_STATUS[order.orderStatus] && (
                            <button
                              onClick={() => promptStatusUpdate(order._id, NEXT_STATUS[order.orderStatus])}
                              disabled={updating === order._id}
                              className="text-xs bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 font-semibold"
                            >
                              {updating === order._id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                `Mark as ${NEXT_STATUS[order.orderStatus]}`
                              )}
                            </button>
                          )}
                          {order.orderStatus === 'delivered' && (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Delivered
                            </span>
                          )}
                          {order.orderStatus === 'cancelled' && (
                            <span className="text-xs text-red-400 font-medium px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">Cancelled by buyer</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Right Sidebar – Seller Insights */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-5 shadow-lg sticky top-6 space-y-5">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs">📊</span>
                Seller Insights
              </h3>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 p-2 rounded-lg text-center">
                  <p className="text-xs font-semibold text-purple-700">Total Revenue</p>
                  <p className="text-sm font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg text-center">
                  <p className="text-xs font-semibold text-blue-700">Success Rate</p>
                  <p className="text-sm font-bold text-gray-800">{successRate}%</p>
                </div>
              </div>

              {/* Delivery Performance Bar */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery Performance</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2.5 rounded-full" style={{ width: `${successRate}%` }}></div>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  ⏳ Pending Orders: {statusCounts.pending}
                </p>
                <p className="text-[10px] text-amber-600 mt-1">These orders need your attention.</p>
              </div>

              {/* Quick Insights */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Quick Insights</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start gap-1">• {statusCounts.shipped} orders in transit</li>
                  <li className="flex items-start gap-1">• {statusCounts.delivered} orders delivered</li>
                  <li className="flex items-start gap-1">• {statusCounts.cancelled} cancellations</li>
                </ul>
              </div>

              {/* AI Suggestion (static) */}
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                  🤖 AI Recommendation
                </p>
                <p className="text-[10px] text-indigo-600 mt-1">
                  Fast shipping labels can improve your delivery success rate by up to 20%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal (unchanged) */}
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-scale-in">
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-3">
                  🚚
                </div>
                <h3 className="text-lg font-bold text-gray-800">Update order status?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mark this order as <span className="font-semibold text-purple-600">{confirmAction.newStatus}</span>?
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleUpdateStatus(confirmAction.orderId, confirmAction.newStatus)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-md">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOrders