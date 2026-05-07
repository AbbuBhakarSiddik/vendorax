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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

        {error && (
          <p className="text-red-500 text-sm mb-6 bg-red-50 border border-red-100 p-3 rounded-lg">{error}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Shipping form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800">Shipping details</h2>
                {savedAddress && !usesSaved && (
                  <button type="button" onClick={applySaved}
                    className="text-xs text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition font-medium">
                    Use saved address
                  </button>
                )}
                {usesSaved && savedAddress && (
                  <span className="text-xs text-teal-600 font-medium bg-teal-50 px-3 py-1.5 rounded-lg">
                    ✓ Using saved address
                  </span>
                )}
                {!savedAddress && !fetchingProfile && (
                  <Link to="/profile?tab=details"
                    className="text-xs text-gray-400 hover:text-purple-600 transition">
                    Save an address in profile →
                  </Link>
                )}
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full name</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone number</label>
                    <input name="phone" required value={form.phone} onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea name="address" required rows={3} value={form.address} onChange={handleChange}
                    placeholder="House no, street, area..."
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input name="city" required value={form.city} onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input name="pincode" required value={form.pincode} onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Payment method</label>
                  <div className="border border-purple-200 bg-purple-50 rounded-lg px-4 py-3 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                    <span className="text-sm text-purple-800 font-medium">Razorpay</span>
                    <span className="text-xs text-purple-500 ml-auto">Cards · UPI · Net banking · Wallets</span>
                  </div>
                </div>

                <button type="submit" disabled={loading || fetchingProfile}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60 mt-2">
                  {loading ? 'Preparing payment...' : `Pay ₹${getTotal().toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-4">Order summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      <p className="text-xs font-bold text-purple-700">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout
