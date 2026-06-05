import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../../store/useCartStore'

const Cart = () => {
  const { items, removeFromCart, updateQty, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  // Empty cart state – redesigned
  if (items.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-purple-50/30 flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <span className="absolute top-1/4 left-[10%] text-5xl opacity-10 animate-float-bounce">🛒</span>
        <span className="absolute bottom-1/3 right-[10%] text-4xl opacity-10 animate-float-bounce" style={{ animationDelay: '1s' }}>📦</span>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="w-28 h-28 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center shadow-xl shadow-purple-500/10">
          <span className="text-6xl">🛒</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 text-lg mb-2">Looks like you haven't added any products yet.</p>
        <p className="text-gray-400 text-sm mb-10">Discover trending products and fill your cart with amazing deals.</p>

        {/* Trending categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Electronics', 'Fashion', 'Home Decor', 'Beauty', 'Sports'].map(cat => (
            <Link
              key={cat}
              to={`/?category=${cat}`}
              className="px-4 py-2 rounded-full border-2 border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all"
            >
              {cat}
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Explore marketplace
        </Link>
      </div>
    </div>
  )

  // Main cart with items
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-purple-50/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl" style={{ animationDelay: '1.5s' }} />
        <span className="absolute top-1/4 right-[10%] text-4xl opacity-10 animate-float-bounce">📦</span>
        <span className="absolute bottom-1/3 left-[10%] text-3xl opacity-10 animate-float-bounce" style={{ animationDelay: '1s' }}>🏷️</span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Premium Header with progress bar */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Shopping Cart
                <span className="ml-3 text-lg font-medium text-gray-400">
                  ({items.length} item{items.length !== 1 ? 's' : ''})
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">You're almost there! Review your items before checkout.</p>
            </div>
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear all
            </button>
          </div>

          {/* Checkout steps progress */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-5 shadow-md">
            <div className="flex items-center justify-between relative">
              {['Cart', 'Shipping', 'Payment', 'Confirmation'].map((step, idx) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className={`relative flex flex-col items-center ${idx === 0 ? 'text-purple-600' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      idx === 0 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {idx === 0 ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg> : idx + 1}
                    </div>
                    <span className="text-xs font-medium mt-2">{step}</span>
                  </div>
                  {idx < 3 && (
                    <div className="flex-1 h-0.5 mx-2 bg-gray-200 mt-[-20px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-5 flex gap-5 card-hover stagger-child group hover:border-purple-200 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Product image with hover zoom */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                      📦
                    </div>
                  )}
                  {/* Badge overlay */}
                  {item.qty === 1 && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Last one!
                    </span>
                  )}
                </div>

                {/* Product details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</h3>
                      {item.storeId && (
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                          {item.storeId.storeName}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 text-sm shrink-0">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-purple-600 font-semibold text-xs mb-3">
                    ₹{item.price?.toLocaleString()} each
                  </p>

                  {/* Quantity controls + Remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <button
                        onClick={() => {
                          if (item.qty === 1) removeFromCart(item._id)
                          else updateQty(item._id, item.qty - 1)
                        }}
                        className="px-4 py-2 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 font-medium"
                      >
                        −
                      </button>
                      <span className="px-5 py-2 text-sm font-semibold text-gray-800 bg-white border-x border-gray-200">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}
                        className="px-4 py-2 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 font-medium"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Recommended products (static) */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">✨</span>
                You may also like
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Wireless Earbuds', price: '2,499', img: '🎧' },
                  { name: 'Leather Wallet', price: '1,199', img: '👛' },
                  { name: 'Desk Lamp', price: '3,299', img: '💡' },
                ].map((prod, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-3 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <span className="text-3xl mb-2 block">{prod.img}</span>
                    <p className="text-xs font-medium text-gray-700">{prod.name}</p>
                    <p className="text-sm font-bold text-purple-600 mt-1">₹{prod.price}</p>
                    <button className="mt-2 text-xs text-purple-600 border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50 transition">
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Coupons */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl border-2 border-gray-200 p-6 shadow-2xl shadow-purple-500/[0.05] sticky top-24 space-y-5">
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>

              {/* Coupon input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
                />
                <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow hover:shadow-md transition">
                  Apply
                </button>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span className="text-amber-500 font-medium">-₹0</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-purple-700">₹{getTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Savings info */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-700">
                🎉 You're saving ₹0 on this order with free delivery!
              </div>

              {/* Checkout button with lock icon */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-2xl text-sm font-bold hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors group"
              >
                <span className="group-hover:underline">Continue shopping</span>
                <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>

              {/* Trust badges */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  100% Secure Payments
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Easy Returns & Refunds
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Buyer Protection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart