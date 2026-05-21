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
    )

    if (orders.length === 0) return (
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
    )

    return (
        <div className="space-y-4">
            {orders.map((order, i) => (
                <div key={order._id}
                    className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 card-hover stagger-child"
                    style={{ animationDelay: `${i * 80}ms` }}>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
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
                            className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors mb-3 group">
                            <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-600">
                                {order.storeId.storeName[0]}
                            </div>
                            {order.storeId.storeName}
                            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
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

                    {/* Shipping address (collapsed) */}
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

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-800">
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'}`}>
                                {order.paymentStatus}
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
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Delivered
                            </span>
                        )}
                        {order.orderStatus === 'cancelled' && (
                            <span className="text-xs text-gray-400 font-medium">Cancelled</span>
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
            // Update zustand + localStorage with new name
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

    const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03] animate-fade-in-up">
            <form onSubmit={handleSave} className="space-y-8">

                {/* Personal info */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Personal Info</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full name</label>
                            <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
                            <input value={user?.email || ''} disabled
                                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Default shipping address */}
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-800">Default Shipping Address</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-4 ml-9">Auto-filled at checkout so you don't have to retype it</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Full name</label>
                            <input name="fullName" value={form.address.fullName} onChange={handleAddressChange}
                                placeholder="Name on shipping label" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Phone</label>
                            <input name="phone" value={form.address.phone} onChange={handleAddressChange}
                                placeholder="10-digit mobile number" className={inputClass} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Address</label>
                        <textarea name="address" rows={2} value={form.address.address} onChange={handleAddressChange}
                            placeholder="House no, street, area..."
                            className={`${inputClass} resize-none`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">City</label>
                            <input name="city" value={form.address.city} onChange={handleAddressChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Pincode</label>
                            <input name="pincode" value={form.address.pincode} onChange={handleAddressChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button type="submit" disabled={saving}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center gap-2">
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
                        <span className="text-sm text-emerald-600 font-semibold flex items-center gap-1 animate-scale-in">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Saved successfully
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

    useEffect(() => {
        api.get('/auth/me')
            .then(res => setProfile(res.data.user))
            .catch(() => setProfile(storeUser))
            .finally(() => setLoading(false))
    }, [storeUser])

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        )},
        { id: 'details', label: 'My Details', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        )}
    ]

    return (
        <div className="min-h-screen bg-[#f8f7fa]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-xl shadow-purple-500/20">
                        {(profile?.name || storeUser?.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                            {loading ? '...' : profile?.name || storeUser?.name}
                        </h1>
                        <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {storeUser?.email}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl mb-8 w-fit animate-fade-in-up animation-delay-100">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'}`}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'orders' && <MyOrders />}
                {activeTab === 'details' && !loading && (
                    <MyDetails user={profile} onUpdate={setProfile} />
                )}

            </div>
        </div>
    )
}

export default Profile
