import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosInstance'
import useAuthStore from '../../../store/useAuthStore'

const STATUS_COLORS = {
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-purple-50 text-purple-700 border-purple-100',
    delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
}

const STATUS_ICONS = {
    pending: '🕒',
    confirmed: '✅',
    shipped: '🚚',
    delivered: '📬',
    cancelled: '❌'
}

// ─── My Orders Tab ────────────────────────────────────────────────────────────
const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState(null)

    const fetchOrders = async () => {
        setLoading(true)
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
        if (!window.confirm('Cancel this order?')) return
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
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i}
                    className="bg-gradient-to-br from-purple-50/70 via-white/60 to-indigo-50/70 backdrop-blur-md rounded-2xl border border-purple-100 p-6 animate-pulse shadow-lg shadow-purple-500/10">
                    <div className="flex justify-between mb-4">
                        <div className="h-4 bg-purple-100/80 rounded-lg w-1/3" />
                        <div className="h-5 bg-purple-100/80 rounded-full w-20" />
                    </div>
                    <div className="h-3 bg-purple-100/80 rounded-lg w-1/2 mb-2" />
                    <div className="h-3 bg-purple-100/80 rounded-lg w-1/3" />
                </div>
            ))}
        </div>
    )

    if (orders.length === 0) return (
        <div className="bg-gradient-to-br from-purple-50/70 via-white/60 to-indigo-50/70 backdrop-blur-md rounded-2xl border border-purple-100 p-16 text-center animate-fade-in-up shadow-lg shadow-purple-500/10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center shadow-inner">
                <span className="text-5xl">📦</span>
            </div>
            <p className="text-xl font-bold text-gray-700 mb-2">You haven't placed any orders yet</p>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">Explore thousands of amazing products and support talented creators worldwide.</p>
            <Link to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                Discover products
            </Link>
        </div>
    )

    return (
        <div className="space-y-4">
            {orders.map((order, i) => (
                <div key={order._id}
                    className="bg-gradient-to-br from-purple-50/70 via-white/60 to-indigo-50/70 backdrop-blur-md rounded-2xl border border-purple-100 p-5 sm:p-6 card-hover stagger-child shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                    style={{ animationDelay: `${i * 80}ms` }}>

                    {/* Header with status badge & timeline icon */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{STATUS_ICONS[order.orderStatus] || '📋'}</span>
                                <div>
                                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        Order
                                        <span className="text-gray-400 font-mono text-xs bg-white/80 px-2 py-0.5 rounded-full">#{order._id.slice(-8).toUpperCase()}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.orderStatus]} flex items-center gap-1.5`}>
                            <span className="text-xs">{STATUS_ICONS[order.orderStatus]}</span>
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                    </div>

                    {/* Store link */}
                    {order.storeId && (
                        <Link to={`/store/${order.storeId.storeSlug}`}
                            className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors mb-4 group">
                            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-600">
                                {order.storeId.storeName[0]}
                            </div>
                            {order.storeId.storeName}
                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>
                    )}

                    {/* Products list with improved styling */}
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3.5 mb-4 space-y-2.5 border border-purple-100/50">
                        {order.products.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-gray-700 flex-1 pr-2">{p.name}</span>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-gray-400 bg-white/80 px-2 py-0.5 rounded-full">x{p.qty}</span>
                                    <span className="font-semibold text-gray-800">₹{(p.price * p.qty).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shipping address (collapsible) */}
                    {order.shippingAddress?.address && (
                        <details className="mb-3 group">
                            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none flex items-center gap-1 font-medium">
                                <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                                Shipping address
                            </summary>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed pl-4 border-l-2 border-gray-100">
                                {order.shippingAddress.fullName} · {order.shippingAddress.phone}<br />
                                {order.shippingAddress.address}, {order.shippingAddress.city} – {order.shippingAddress.pincode}
                            </p>
                        </details>
                    )}

                    {/* Footer with total and actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-purple-100/60">
                        <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-gray-800">
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                order.paymentStatus === 'paid'
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                            }`}>
                                {order.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                            </span>
                        </div>
                        {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                            <button onClick={() => handleCancel(order._id)}
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
                        {order.orderStatus === 'delivered' && (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Delivered
                            </span>
                        )}
                        {order.orderStatus === 'cancelled' && (
                            <span className="text-xs text-gray-400 font-medium bg-white/80 px-3 py-1.5 rounded-full border border-gray-200">
                                Cancelled
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── My Details Tab ───────────────────────────────────────────────────────────
const MyDetails = ({ user, onUpdate }) => {
    const [form, setForm] = useState({
        name: user?.name || '',
        address: {
            fullName: user?.savedAddress?.fullName || '',
            phone: user?.savedAddress?.phone || '',
            address: user?.savedAddress?.address || '',
            city: user?.savedAddress?.city || '',
            pincode: user?.savedAddress?.pincode || ''
        }
    })
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleAddressChange = (e) =>
        setForm({ ...form, address: { ...form.address, [e.target.name]: e.target.value } })

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setSuccess(false)
        try {
            const res = await api.put('/auth/profile', {
                name: form.name,
                savedAddress: form.address
            })
            const stored = JSON.parse(localStorage.getItem('user') || '{}')
            const updatedUser = { ...stored, name: res.data.user.name }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setSuccess(true)
            onUpdate(res.data.user)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const inputClass = "w-full border border-gray-200/70 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200/50 transition-all duration-200 hover:bg-white hover:shadow-sm placeholder:text-gray-300"

    return (
        <div className="space-y-6 animate-fade-in-up">
            <form onSubmit={handleSave}>
                {/* Personal Information Card */}
                <div className="bg-gradient-to-br from-violet-50/80 via-white/70 to-purple-50/80 backdrop-blur-lg rounded-2xl border border-violet-100 p-6 sm:p-8 shadow-lg shadow-violet-500/10 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Full name</label>
                            <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Email address</label>
                            <input value={user?.email || ''} disabled
                                className="w-full border border-gray-100 bg-gray-50/80 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Default Shipping Address Card */}
                <div className="bg-gradient-to-br from-indigo-50/80 via-white/70 to-blue-50/80 backdrop-blur-lg rounded-2xl border border-indigo-100 p-6 sm:p-8 shadow-lg shadow-indigo-500/10 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Default Shipping Address</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-6 ml-11">This address will be pre‑filled at checkout for a faster experience.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Full Name</label>
                            <input name="fullName" value={form.address.fullName} onChange={handleAddressChange}
                                placeholder="Name on shipping label" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Phone</label>
                            <input name="phone" value={form.address.phone} onChange={handleAddressChange}
                                placeholder="10-digit mobile number" className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Address</label>
                        <textarea name="address" rows={3} value={form.address.address} onChange={handleAddressChange}
                            placeholder="House no, street, area..."
                            className={`${inputClass} resize-none`} />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">City</label>
                            <input name="city" value={form.address.city} onChange={handleAddressChange} className={inputClass} placeholder="City" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Pincode</label>
                            <input name="pincode" value={form.address.pincode} onChange={handleAddressChange} className={inputClass} placeholder="6-digit pincode" />
                        </div>
                    </div>
                </div>

                {/* Save Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-5 shadow-sm">
                    <button type="submit" disabled={saving}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center gap-2">
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Save changes
                            </>
                        )}
                    </button>
                    {success && (
                        <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 animate-scale-in">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Profile updated successfully
                        </span>
                    )}
                </div>
            </form>
        </div>
    )
}

// ─── Profile Page (wrapper with tabs) ────────────────────────────────────────
const Profile = () => {
    const { user: storeUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState('orders')
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [orderCount, setOrderCount] = useState(null)

    useEffect(() => {
        api.get('/auth/me')
            .then(res => setProfile(res.data.user))
            .catch(() => setProfile(storeUser))
            .finally(() => setLoading(false))
    }, [storeUser])

    // Fetch order count for stats (separate from MyOrders internal fetch)
    useEffect(() => {
        api.get('/orders/buyer')
            .then(res => setOrderCount(res.data.orders?.length || 0))
            .catch(() => setOrderCount(0))
    }, [])

    const tabs = [
        {
            id: 'orders',
            label: 'Orders Hub',
            subtitle: 'Manage & track purchases',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            id: 'details',
            label: 'Account Center',
            subtitle: 'Profile & shipping details',
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ]

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background with floating gradients and decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f9f8fc] via-white to-purple-50/50 -z-10" />
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float-smooth -z-10" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float-smooth-delayed -z-10" />
            <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-violet-200/25 rounded-full blur-3xl animate-float-smooth-slow -z-10" />

            {/* Decorative icons */}
            <div className="absolute top-28 left-12 text-4xl opacity-20 select-none pointer-events-none animate-float-smooth-slow" style={{ animationDelay: '1s' }}>🛍️</div>
            <div className="absolute top-1/3 right-16 text-4xl opacity-20 select-none pointer-events-none animate-float-smooth" style={{ animationDelay: '2s' }}>📦</div>
            <div className="absolute bottom-24 left-1/4 text-3xl opacity-20 select-none pointer-events-none animate-float-smooth-delayed" style={{ animationDelay: '0.5s' }}>🏪</div>
            <div className="absolute bottom-40 right-1/4 text-3xl opacity-20 select-none pointer-events-none animate-float-smooth">🚚</div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">

                {/* ─── Profile Hero Card ──────────────────────────────────────── */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl shadow-purple-500/[0.05] animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shrink-0 shadow-xl shadow-purple-500/30 ring-4 ring-white/50">
                            {(profile?.name || storeUser?.name || '?')[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
                                    {loading ? '...' : profile?.name || storeUser?.name}
                                </h1>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 text-purple-700 border border-purple-200/50">
                                    {storeUser?.role || 'buyer'}
                                </span>
                            </div>
                            <p className="text-base sm:text-lg text-gray-500 font-medium mt-1">
                                Welcome back 👋 Ready to discover something amazing today?
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {profile?.createdAt
                                        ? `Member since ${new Date(profile.createdAt).getFullYear()}`
                                        : 'Member since 2025'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {storeUser?.email}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Stats Section ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 p-5 flex flex-col items-start shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-md">
                            <span className="text-white text-xl">📦</span>
                        </div>
                        <span className="text-2xl font-black text-gray-800">{orderCount !== null ? orderCount : '—'}</span>
                        <span className="text-xs font-medium text-gray-500 mt-1">Total Orders</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 p-5 flex flex-col items-start shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-3 shadow-md">
                            <span className="text-white text-xl">❤️</span>
                        </div>
                        <span className="text-2xl font-black text-gray-800">0</span>
                        <span className="text-xs font-medium text-gray-500 mt-1">Wishlist Items</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 p-5 flex flex-col items-start shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-3 shadow-md">
                            <span className="text-white text-xl">✅</span>
                        </div>
                        <span className="text-2xl font-black text-gray-800">{orderCount !== null ? orderCount : '—'}</span>
                        <span className="text-xs font-medium text-gray-500 mt-1">Purchases</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 p-5 flex flex-col items-start shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-3 shadow-md">
                            <span className="text-white text-xl">⭐</span>
                        </div>
                        <span className="text-2xl font-black text-gray-800">Active</span>
                        <span className="text-xs font-medium text-gray-500 mt-1">Account Status</span>
                    </div>
                </div>

                {/* ─── Tabs (Enhanced – not matching main background) ───────── */}
                <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="inline-flex bg-white border border-purple-100 p-1.5 rounded-2xl shadow-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                <div className="text-left">
                                    <div>{tab.label}</div>
                                    <div className={`text-[11px] font-medium ${activeTab === tab.id ? 'text-white/80' : 'text-gray-400'}`}>{tab.subtitle}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── Tab Content ──────────────────────────────────────────────── */}
                {activeTab === 'orders' && <MyOrders />}
                {activeTab === 'details' && !loading && (
                    <MyDetails user={profile} onUpdate={setProfile} />
                )}

            </div>
        </div>
    )
}

export default Profile