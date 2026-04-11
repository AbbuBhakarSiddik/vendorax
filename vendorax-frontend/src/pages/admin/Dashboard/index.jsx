import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlatformStats } from '../../../api/admin'

const STATUS_COLORS = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-teal-50 text-teal-700',
    cancelled: 'bg-red-50 text-red-600'
}

const StatCard = ({ label, value, color, to }) => (
    <Link to={to || '#'}
        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color || 'text-gray-800'}`}>{value}</p>
    </Link>
)

const AdminDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPlatformStats()
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
                            <div className="h-8 bg-gray-100 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Admin dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Platform overview</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total revenue"
                        value={`₹${data.totalRevenue.toLocaleString()}`}
                        color="text-purple-700" />
                    <StatCard label="Total orders"
                        value={data.totalOrders}
                        to="/admin/orders" />
                    <StatCard label="Total stores"
                        value={data.totalStores}
                        color="text-teal-700"
                        to="/admin/stores" />
                    <StatCard label="Total users"
                        value={data.totalUsers}
                        to="/admin/users" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <StatCard label="Sellers"
                        value={data.totalSellers}
                        color="text-amber-600"
                        to="/admin/users" />
                    <StatCard label="Buyers"
                        value={data.totalBuyers}
                        to="/admin/users" />
                    <StatCard label="Total products"
                        value={data.totalProducts}
                        color="text-blue-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Recent orders */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-gray-800">Recent orders</h2>
                            <Link to="/admin/orders"
                                className="text-xs text-purple-600 hover:underline">
                                View all
                            </Link>
                        </div>
                        {data.recentOrders.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentOrders.map(order => (
                                    <div key={order._id}
                                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-xs font-medium text-gray-800">
                                                {order.buyerId?.name || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {order.storeId?.storeName || 'Unknown store'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-gray-800">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent users */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-gray-800">Recent users</h2>
                            <Link to="/admin/users"
                                className="text-xs text-purple-600 hover:underline">
                                View all
                            </Link>
                        </div>
                        {data.recentUsers.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No users yet</p>
                        ) : (
                            <div className="space-y-3">
                                {data.recentUsers.map(user => (
                                    <div key={user._id}
                                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-xs font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'seller'
                                            ? 'bg-purple-50 text-purple-700'
                                            : user.role === 'admin'
                                                ? 'bg-red-50 text-red-600'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.role}
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

export default AdminDashboard