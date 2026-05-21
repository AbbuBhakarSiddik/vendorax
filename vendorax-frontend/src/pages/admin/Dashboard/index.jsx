import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlatformStats } from '../../../api/admin'

const STATUS_COLORS = { pending: 'bg-amber-50 text-amber-700', confirmed: 'bg-blue-50 text-blue-700', shipped: 'bg-purple-50 text-purple-700', delivered: 'bg-emerald-50 text-emerald-700', cancelled: 'bg-red-50 text-red-600' }

const StatCard = ({ label, value, icon, gradient, to }) => (
    <Link to={to || '#'} className="bg-white rounded-2xl border border-gray-100 p-5 card-hover group">
        <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <span className="text-white text-sm">{icon}</span>
            </div>
        </div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
    </Link>
)

const AdminDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { getPlatformStats().then(res => setData(res.data)).catch(() => {}).finally(() => setLoading(false)) }, [])

    if (loading) return (
        <div className="min-h-screen bg-[#f8f7fa]"><div className="max-w-6xl mx-auto px-4 sm:px-6 py-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">{[1,2,3,4].map(i => (<div key={i} className="bg-white rounded-2xl border border-gray-100 p-5"><div className="h-3 bg-gray-100 rounded-lg w-1/2 mb-3" /><div className="h-8 bg-gray-100 rounded-lg w-2/3" /></div>))}</div></div></div>
    )

    return (
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div><h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1><p className="text-gray-400 text-sm">Platform overview</p></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up animation-delay-100">
                    <StatCard label="Total revenue" value={`₹${data.totalRevenue.toLocaleString()}`} icon="💰" gradient="from-violet-500 to-purple-600" />
                    <StatCard label="Total orders" value={data.totalOrders} icon="📋" gradient="from-blue-500 to-cyan-500" to="/admin/orders" />
                    <StatCard label="Total stores" value={data.totalStores} icon="🏪" gradient="from-emerald-500 to-teal-500" to="/admin/stores" />
                    <StatCard label="Total users" value={data.totalUsers} icon="👥" gradient="from-amber-500 to-orange-500" to="/admin/users" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up animation-delay-200">
                    <StatCard label="Sellers" value={data.totalSellers} icon="🏷️" gradient="from-purple-500 to-pink-500" to="/admin/users" />
                    <StatCard label="Buyers" value={data.totalBuyers} icon="🛒" gradient="from-sky-500 to-blue-500" to="/admin/users" />
                    <StatCard label="Products" value={data.totalProducts} icon="📦" gradient="from-rose-500 to-red-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2"><svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Recent orders</h2>
                            <Link to="/admin/orders" className="text-xs text-purple-600 hover:text-purple-700 font-semibold">View all →</Link>
                        </div>
                        {data.recentOrders.length === 0 ? (<p className="text-gray-400 text-sm text-center py-8">No orders yet</p>) : (
                            <div className="space-y-3">{data.recentOrders.map(order => (
                                <div key={order._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                                    <div><p className="text-xs font-semibold text-gray-800">{order.buyerId?.name || 'Unknown'}</p><p className="text-[10px] text-gray-400">{order.storeId?.storeName || 'Unknown store'}</p></div>
                                    <div className="text-right"><p className="text-xs font-bold text-gray-800">₹{order.totalAmount.toLocaleString()}</p><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span></div>
                                </div>
                            ))}</div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03]">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2"><svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Recent users</h2>
                            <Link to="/admin/users" className="text-xs text-purple-600 hover:text-purple-700 font-semibold">View all →</Link>
                        </div>
                        {data.recentUsers.length === 0 ? (<p className="text-gray-400 text-sm text-center py-8">No users yet</p>) : (
                            <div className="space-y-3">{data.recentUsers.map(user => (
                                <div key={user._id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-600">{user.name?.[0]?.toUpperCase()}</div>
                                        <div><p className="text-xs font-semibold text-gray-800">{user.name}</p><p className="text-[10px] text-gray-400">{user.email}</p></div>
                                    </div>
                                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${user.role === 'seller' ? 'bg-purple-50 text-purple-700' : user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
                                </div>
                            ))}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard