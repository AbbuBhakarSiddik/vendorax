import { useEffect, useState } from 'react'
import api from '../../../api/axiosInstance'
import { getMyStore } from '../../../api/store'

const STATUS_COLORS = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-teal-50 text-teal-700',
    cancelled: 'bg-red-50 text-red-600'
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
        }
    }

    const filtered = filter === 'all'
        ? orders
        : orders.filter(o => o.orderStatus === filter)

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 mb-4 animate-pulse">
                        <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                        <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {orders.length} total order{orders.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                {/* Filter tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button key={status} onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${filter === status
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                                }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === 'all'
                                ? ` (${orders.length})`
                                : ` (${orders.filter(o => o.orderStatus === status).length})`
                            }
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                        <p className="text-gray-400 text-5xl mb-4">📋</p>
                        <p className="text-gray-600 font-medium text-sm">No orders yet</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Orders will appear here once buyers start purchasing
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map(order => (
                            <div key={order._id}
                                className="bg-white rounded-xl border border-gray-200 p-5">

                                {/* Order header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                    </span>
                                </div>

                                {/* Buyer info */}
                                {order.buyerId && (
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <p className="text-xs font-medium text-gray-700">
                                            {order.buyerId.name}
                                        </p>
                                        <p className="text-xs text-gray-500">{order.buyerId.email}</p>
                                        {order.shippingAddress && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.pincode}
                                            </p>
                                        )}
                                        {order.shippingAddress?.phone && (
                                            <p className="text-xs text-gray-500">
                                                {order.shippingAddress.phone}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Products */}
                                <div className="space-y-2 mb-4">
                                    {order.products.map((p, i) => (
                                        <div key={i}
                                            className="flex justify-between items-center text-xs text-gray-600 py-1 border-b border-gray-50 last:border-0">
                                            <span className="font-medium">{p.name}
                                                <span className="text-gray-400 font-normal ml-1">× {p.qty}</span>
                                            </span>
                                            <span className="font-semibold text-gray-800">
                                                ₹{(p.price * p.qty).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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

                                    {/* Status update button */}
                                    {NEXT_STATUS[order.orderStatus] && (
                                        <button
                                            onClick={() => handleUpdateStatus(order._id, NEXT_STATUS[order.orderStatus])}
                                            disabled={updating === order._id}
                                            className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-50 flex items-center gap-1">
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
                                        <span className="text-xs text-teal-600 font-medium">
                                            Delivered
                                        </span>
                                    )}

                                    {order.orderStatus === 'cancelled' && (
                                        <span className="text-xs text-red-500 font-medium">
                                            Cancelled by buyer
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

export default SellerOrders