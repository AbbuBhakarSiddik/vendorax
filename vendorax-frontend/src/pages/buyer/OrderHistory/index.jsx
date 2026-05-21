import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosInstance'

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
  shipped: 'bg-purple-50 text-purple-700 border-purple-100',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100'
}

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

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

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-3 bg-gray-100 rounded-lg w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
            <p className="text-gray-400 text-sm">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-gray-700 font-semibold">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Start shopping to see your orders here</p>
            <Link to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <div key={order._id}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover stagger-child"
                style={{ animationDelay: `${i * 80}ms` }}>

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      <span className="text-gray-400 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.orderStatus]}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                {/* Store */}
                {order.storeId && (
                  <Link to={`/store/${order.storeId.storeSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors mb-3">
                    <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-600">
                      {order.storeId.storeName[0]}
                    </div>
                    {order.storeId.storeName}
                  </Link>
                )}

                {/* Products */}
                <div className="bg-gray-50/80 rounded-xl p-3 space-y-1.5 mb-4">
                  {order.products.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-gray-600">
                      <span className="font-medium">{p.name} <span className="text-gray-400">× {p.qty}</span></span>
                      <span className="font-semibold text-gray-700">₹{(p.price * p.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={cancelling === order._id}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 flex items-center gap-1">
                      {cancelling === order._id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          Cancelling...
                        </>
                      ) : 'Cancel order'}
                    </button>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <span className="text-xs text-gray-400 font-medium">Order cancelled</span>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Delivered
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory