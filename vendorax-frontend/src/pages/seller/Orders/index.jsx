import { useEffect, useState } from 'react'
import api from '../../../api/axiosInstance'
import { getMyStore } from '../../../api/store'

const STATUS_COLORS = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400' }
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

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === filter)

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length
  }

  // Map filter to its corresponding color for active tab
  const filterGradientMap = {
    all: 'from-violet-600 to-purple-600',
    pending: 'from-amber-500 to-orange-500',
    confirmed: 'from-blue-500 to-blue-600',
    shipped: 'from-purple-500 to-purple-600',
    delivered: 'from-emerald-500 to-teal-500',
    cancelled: 'from-red-500 to-red-600'
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200" />
            <div>
              <div className="h-6 w-24 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-20 h-9 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>
        {/* Order skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-5 bg-gray-100 rounded-lg w-1/3" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-16 bg-gray-50 rounded-xl mb-3" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Animated background graphics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-float-bounce"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-10 right-20 w-48 h-48 bg-amber-100/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-emerald-100/20 rounded-full blur-2xl" style={{ animationDelay: '2s' }}></div>
        {/* Decorative icons */}
        <div className="absolute top-20 left-1/3 text-4xl opacity-10 select-none">📦</div>
        <div className="absolute bottom-32 right-1/4 text-4xl opacity-10 select-none">🏷️</div>
        <div className="absolute top-1/2 right-10 text-3xl opacity-10 select-none">🛒</div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
              <p className="text-gray-400 text-sm">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {/* Quick summary chips */}
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-scale-in shadow-sm">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-700 font-medium text-sm">{error}</p>
              <button onClick={fetchOrders} className="text-red-600 underline text-xs mt-1 hover:text-red-800">Retry</button>
            </div>
          </div>
        )}

        {/* Filter tabs with status colors when active */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar animate-fade-in-up animation-delay-100">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button key={status} onClick={() => setFilter(status)}
              className={`relative px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border flex items-center gap-1.5 ${
                filter === status
                  ? `bg-gradient-to-r ${filterGradientMap[status]} text-white border-transparent shadow-lg`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-sm'
              }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className={`${filter === status ? 'bg-white/20' : 'bg-gray-100'} px-1.5 py-0.5 rounded-full text-[10px]`}>
                {statusCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white/50 p-16 text-center animate-scale-in shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
              <span className="text-4xl">📋</span>
            </div>
            <p className="text-gray-600 font-bold text-lg mb-1">No orders found</p>
            <p className="text-gray-400 text-sm">
              {filter === 'all' ? 'Orders will appear here once buyers start purchasing' : `No ${filter} orders at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => {
              const statusStyle = STATUS_COLORS[order.orderStatus]
              return (
                <div key={order._id}
                  className={`bg-white rounded-2xl border-2 ${statusStyle.border} p-5 sm:p-6 transition-all duration-300 hover:shadow-md shadow-sm stagger-child relative overflow-hidden`}
                  style={{ animationDelay: `${i * 80}ms` }}>
                  {/* Colored left accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusStyle.dot}`} />

                  {/* Order header */}
                  <div className="flex items-start justify-between mb-4 pl-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">
                          Order <span className="text-gray-400 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          {STATUS_ICONS[order.orderStatus]} {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 pl-0">
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

                  {/* Buyer & Shipping Info */}
                  {order.buyerId && (
                    <div className="bg-gray-50/80 rounded-xl p-4 mb-4 pl-2">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
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
                  <div className="mb-4 pl-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Products</p>
                    <div className="space-y-2">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-white rounded-lg p-2 border border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{p.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">x{p.qty}</span>
                          </div>
                          <span className="font-bold text-gray-800">₹{(p.price * p.qty).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 pl-2">
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
                          className="text-xs bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-violet-700 hover:to-purple-700 shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5 font-semibold">
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
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-lg">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Delivered
                        </span>
                      )}
                      {order.orderStatus === 'cancelled' && (
                        <span className="text-xs text-red-400 font-medium px-3 py-1.5 bg-red-50 rounded-lg">Cancelled by buyer</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Confirmation Modal */}
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
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(confirmAction.orderId, confirmAction.newStatus)}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-md shadow-purple-500/20">
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