import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useCartStore from '../../../store/useCartStore'
import useAuthStore from '../../../store/useAuthStore'
import api from '../../../api/axiosInstance'

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

const EMPTY_FORM = { fullName: '', phone: '', address: '', city: '', pincode: '' }

const InputField = ({ label, icon, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input {...props}
        className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 ${icon ? 'pl-10' : ''}`} />
    </div>
  </div>
)

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const user = useAuthStore(s => s.user)
  const orderPlaced = useRef(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [savedAddress, setSavedAddress] = useState(null)
  const [usesSaved, setUsesSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingProfile, setFetchingProfile] = useState(true)
  const [error, setError] = useState('')

  // Fetch saved address on mount
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        const addr = res.data.user?.savedAddress
        if (addr?.address) {
          setSavedAddress(addr)
          setForm(addr)
          setUsesSaved(true)
        } else {
          setForm({ ...EMPTY_FORM, fullName: user?.name || '' })
        }
      })
      .catch(() => {
        setForm({ ...EMPTY_FORM, fullName: user?.name || '' })
      })
      .finally(() => setFetchingProfile(false))
  }, [user?.name])

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) navigate('/')
  }, [items, navigate])

  if (items.length === 0 && !orderPlaced.current) return null

  const handleChange = (e) => {
    setUsesSaved(false)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const applySaved = () => {
    setForm(savedAddress)
    setUsesSaved(true)
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const sdkLoaded = await loadRazorpayScript()
      if (!sdkLoaded) {
        setError('Failed to load payment gateway. Check your connection.')
        setLoading(false)
        return
      }

      const byStore = {}
      items.forEach(item => {
        const storeId = item.storeId?._id || item.storeId
        if (!byStore[storeId]) byStore[storeId] = []
        byStore[storeId].push(item)
      })

      for (const storeId of Object.keys(byStore)) {
        const storeItems = byStore[storeId]
        const total = storeItems.reduce((sum, i) => sum + i.price * i.qty, 0)
        const products = storeItems.map(i => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          qty: i.qty
        }))

        const { data } = await api.post('/orders/payment/initiate', {
          storeId,
          products,
          totalAmount: total,
          shippingAddress: form
        })

        await new Promise((resolve, reject) => {
          const options = {
            key: data.keyId,
            amount: data.amount,
            currency: data.currency,
            name: 'VendoraX',
            description: 'Order from store',
            order_id: data.razorpayOrderId,
            prefill: {
              name: form.fullName,
              contact: form.phone,
              email: user?.email || ''
            },
            theme: { color: '#7C3AED' },
            handler: async (response) => {
              try {
                await api.post('/orders/payment/verify', {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: data.orderData
                })
                resolve()
              } catch (err) { reject(err) }
            },
            modal: { ondismiss: () => reject(new Error('Payment cancelled by user')) }
          }
          const rzp = new window.Razorpay(options)
          rzp.on('payment.failed', (r) => reject(new Error(r.error.description || 'Payment failed')))
          rzp.open()
        })
      }

      orderPlaced.current = true
      clearCart()
      navigate('/profile', { replace: true })

    } catch (err) {
      if (err.message === 'Payment cancelled by user') {
        setError('Payment was cancelled. Your cart is still saved.')
      } else {
        setError(err.response?.data?.message || err.message || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/cart" className="hover:text-purple-600 transition-colors">Cart</Link>
            <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium">Checkout</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-400 text-sm mt-1">Complete your order securely</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-scale-in">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ─── Shipping Form ───────────────────────────────────── */}
          <div className="lg:col-span-2 animate-fade-in-up animation-delay-100">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="font-bold text-gray-800">Shipping Details</h2>
                </div>
                {savedAddress && !usesSaved && (
                  <button type="button" onClick={applySaved}
                    className="text-xs text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Use saved
                  </button>
                )}
                {usesSaved && savedAddress && (
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Saved address
                  </span>
                )}
                {!savedAddress && !fetchingProfile && (
                  <Link to="/profile?tab=details"
                    className="text-xs text-gray-400 hover:text-purple-600 transition flex items-center gap-1">
                    Save address in profile
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Full name" name="fullName" required value={form.fullName} onChange={handleChange}
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                  <InputField label="Phone number" name="phone" required value={form.phone} onChange={handleChange}
                    placeholder="10-digit mobile number"
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Address</label>
                  <textarea name="address" required rows={3} value={form.address} onChange={handleChange}
                    placeholder="House no, street, area..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="City" name="city" required value={form.city} onChange={handleChange} />
                  <InputField label="Pincode" name="pincode" required value={form.pincode} onChange={handleChange} />
                </div>

                {/* Payment method */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">Payment Method</label>
                  <div className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-purple-500/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <span className="text-sm text-purple-800 font-semibold">Razorpay</span>
                    <span className="text-xs text-purple-500 ml-auto font-medium">Cards · UPI · Net banking · Wallets</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || fetchingProfile}
                  className="w-full mt-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Preparing payment...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay ₹{getTotal().toLocaleString()}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ─── Order Summary ───────────────────────────────────── */}
          <div className="animate-slide-in-right animation-delay-300">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-xl shadow-purple-500/[0.03]">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3 group">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                        <span className="text-gray-300 text-lg">📦</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                      <p className="text-xs font-bold text-purple-600 mt-0.5">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Subtotal</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <span>Delivery</span>
                  <span className="text-emerald-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-purple-700">₹{getTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security badge */}
              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Payments are secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout
