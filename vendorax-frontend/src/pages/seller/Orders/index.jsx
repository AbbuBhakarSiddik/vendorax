import { useEffect, useState } from 'react'
import api from '../../../api/axiosInstance'
import { getMyStore } from '../../../api/store'

const STATUS_COLORS = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-purple-50 text-purple-700 border-purple-100',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
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
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
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
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                            <p className="text-gray-400 text-sm">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-scale-in">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar animate-fade-in-up animation-delay-100">
                    {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button key={status} onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${filter === status
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/25'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className="ml-1.5 opacity-70">
                                {status === 'all' ? orders.length : orders.filter(o => o.orderStatus === status).length}
                            </span>
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <span className="text-3xl">📋</span>
                        </div>
                        <p className="text-gray-600 font-semibold text-sm">No orders yet</p>
                        <p className="text-gray-400 text-xs mt-1">Orders will appear here once buyers start purchasing</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order, i) => (
                            <div key={order._id}
                                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover stagger-child"
                                style={{ animationDelay: `${i * 80}ms` }}>

                                {/* Order header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            Order <span className="text-gray-400 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                                        </p>
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
                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.orderStatus]}`}>
                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                    </span>
                                </div>

                                {/* Buyer info */}
                                {order.buyerId && (
                                    <div className="bg-gray-50/80 rounded-xl p-4 mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {order.buyerId.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700">{order.buyerId.name}</p>
                                                <p className="text-[10px] text-gray-400">{order.buyerId.email}</p>
                                            </div>
                                        </div>
                                        {order.shippingAddress && (
                                            <p className="text-xs text-gray-500 pl-11">
                                                {order.shippingAddress.address}, {order.shippingAddress.city} — {order.shippingAddress.pincode}
                                            </p>
                                        )}
                                        {order.shippingAddress?.phone && (
                                            <p className="text-xs text-gray-400 pl-11 flex items-center gap-1 mt-0.5">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {order.shippingAddress.phone}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Products */}
                                <div className="space-y-2 mb-4">
                                    {order.products.map((p, idx) => (
                                        <div key={idx}
                                            className="flex justify-between items-center text-xs text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                                            <span className="font-medium">{p.name}
                                                <span className="text-gray-400 font-normal ml-1">× {p.qty}</span>
                                            </span>
                                            <span className="font-bold text-gray-800">₹{(p.price * p.qty).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</span>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                                            ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>

                                    {NEXT_STATUS[order.orderStatus] && (
                                        <button
                                            onClick={() => handleUpdateStatus(order._id, NEXT_STATUS[order.orderStatus])}
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
                                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Delivered
                                        </span>
                                    )}

                                    {order.orderStatus === 'cancelled' && (
                                        <span className="text-xs text-red-400 font-medium">Cancelled by buyer</span>
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