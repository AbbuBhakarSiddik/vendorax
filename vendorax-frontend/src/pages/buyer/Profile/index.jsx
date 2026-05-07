import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosInstance'
import useAuthStore from '../../../store/useAuthStore'

const STATUS_COLORS = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-teal-50 text-teal-700',
    cancelled: 'bg-red-50 text-red-600'
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
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
            ))}
        </div>
    )

    if (orders.length === 0) return (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-600 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Start shopping to see your orders here</p>
            <Link to="/" className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition">
                Browse marketplace
            </Link>
        </div>
    )

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5">

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
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.orderStatus]}`}>
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

                    {/* Shipping address (collapsed) */}
                    {order.shippingAddress?.address && (
                        <details className="mt-3">
                            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
                                Shipping address
                            </summary>
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                {order.shippingAddress.fullName} · {order.shippingAddress.phone}<br />
                                {order.shippingAddress.address}, {order.shippingAddress.city} – {order.shippingAddress.pincode}
                            </p>
                        </details>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-800">
                                ₹{order.totalAmount.toLocaleString()}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === 'paid'
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-amber-50 text-amber-700'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                            <button onClick={() => handleCancel(order._id)}
                                disabled={cancelling === order._id}
                                className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition disabled:opacity-50">
                                {cancelling === order._id ? 'Cancelling...' : 'Cancel order'}
                            </button>
                        )}
                        {order.orderStatus === 'delivered' && (
                            <span className="text-xs text-teal-600 font-medium">✓ Delivered</span>
                        )}
                        {order.orderStatus === 'cancelled' && (
                            <span className="text-xs text-gray-400">Cancelled</span>
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

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSave} className="space-y-6">

                {/* Personal info */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Full name</label>
                            <input name="name" value={form.name} onChange={handleChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Email</label>
                            <input value={user?.email || ''} disabled
                                className="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed" />
                        </div>
                    </div>
                </div>

                {/* Default shipping address */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Default shipping address</h3>
                    <p className="text-xs text-gray-400 mb-3">Saved here, auto-filled at checkout so you don't have to retype it.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-medium text-gray-600">Full name</label>
                            <input name="fullName" value={form.address.fullName} onChange={handleAddressChange}
                                placeholder="Name on shipping label"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Phone</label>
                            <input name="phone" value={form.address.phone} onChange={handleAddressChange}
                                placeholder="10-digit mobile number"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="text-xs font-medium text-gray-600">Address</label>
                        <textarea name="address" rows={2} value={form.address.address} onChange={handleAddressChange}
                            placeholder="House no, street, area..."
                            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="text-xs font-medium text-gray-600">City</label>
                            <input name="city" value={form.address.city} onChange={handleAddressChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-600">Pincode</label>
                            <input name="pincode" value={form.address.pincode} onChange={handleAddressChange}
                                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button type="submit" disabled={saving}
                        className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60">
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                    {success && (
                        <span className="text-sm text-teal-600 font-medium">✓ Saved successfully</span>
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
        { id: 'orders', label: '📦 My Orders' },
        { id: 'details', label: '👤 My Details' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold shrink-0">
                        {(profile?.name || storeUser?.name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            {loading ? '...' : profile?.name || storeUser?.name}
                        </h1>
                        <p className="text-sm text-gray-400">{storeUser?.email}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'}`}>
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
