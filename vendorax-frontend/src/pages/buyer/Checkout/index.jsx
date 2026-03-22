import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../../store/useCartStore'
import useAuthStore from '../../../store/useAuthStore'
import api from '../../../api/axiosInstance'

const Checkout = () => {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const user = useAuthStore(s => s.user)
  const orderPlaced = useRef(false)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) {
      navigate('/')
    }
  }, [items, navigate])

  if (items.length === 0 && !orderPlaced.current) return null

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const orders = {}
      items.forEach(item => {
        const storeId = item.storeId?._id || item.storeId
        if (!orders[storeId]) orders[storeId] = []
        orders[storeId].push(item)
      })

      console.log('Orders grouped:', orders)

      for (const storeId of Object.keys(orders)) {
        const storeItems = orders[storeId]
        const total = storeItems.reduce((sum, i) => sum + i.price * i.qty, 0)

        const payload = {
          storeId,
          products: storeItems.map(i => ({
            productId: i._id,
            name: i.name,
            price: i.price,
            qty: i.qty
          })),
          totalAmount: total,
          paymentStatus: 'paid',
          paymentGateway: 'razorpay',
          shippingAddress: form
        }

        console.log('Sending order payload:', payload)
        const res = await api.post('/orders', payload)
        console.log('Order response:', res.data)
      }

      console.log('All orders placed, navigating...')
      orderPlaced.current = true
      clearCart()
      navigate('/orders', { replace: true })
    } catch (err) {
      console.error('Order error:', err)
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

        {error && (
          <p className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Shipping form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-800 mb-5">Shipping details</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full name</label>
                    <input name="fullName" required value={form.fullName}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone number</label>
                    <input name="phone" required value={form.phone}
                      onChange={handleChange} placeholder="10-digit mobile number"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea name="address" required rows={3} value={form.address}
                    onChange={handleChange} placeholder="House no, street, area..."
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input name="city" required value={form.city}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <input name="pincode" required value={form.pincode}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Payment method
                  </label>
                  <div className="border border-purple-200 bg-purple-50 rounded-lg px-4 py-3 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600" />
                    <span className="text-sm text-purple-800 font-medium">
                      Razorpay — Test mode
                    </span>
                    <span className="text-xs text-purple-500 ml-auto">
                      No real payment
                    </span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-60 mt-2">
                  {loading ? 'Placing order...' : `Place order · ₹${getTotal().toLocaleString()}`}
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
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      <p className="text-xs font-bold text-purple-700">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </p>
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