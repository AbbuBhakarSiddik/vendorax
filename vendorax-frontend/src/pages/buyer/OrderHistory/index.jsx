import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosInstance'

const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-teal-50 text-teal-700',
  cancelled: 'bg-red-50 text-red-600'
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Your orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-gray-400 text-5xl mb-4">📦</p>
            <p className="text-gray-600 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/"
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition">
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id}
                className="bg-white rounded-xl border border-gray-200 p-5">

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                {/* Store */}
                {order.storeId && (
                  <Link to={`/store/${order.storeId.storeSlug}`}
                    className="text-xs text-purple-600 hover:underline font-medium">
                    {order.storeId.storeName}
                  </Link>
                )}

                {/* Products */}
                <div className="mt-3 space-y-1">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span>{p.name} × {p.qty}</span>
                      <span>₹{(p.price * p.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                      ? 'bg-teal-50 text-teal-700'
                      : 'bg-amber-50 text-amber-700'
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Cancel button — only show if cancellable */}
                  {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={cancelling === order._id}
                      className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition disabled:opacity-50">
                      {cancelling === order._id ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}

                  {order.orderStatus === 'cancelled' && (
                    <span className="text-xs text-gray-400">Order cancelled</span>
                  )}

                  {order.orderStatus === 'delivered' && (
                    <span className="text-xs text-teal-600 font-medium">Delivered</span>
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