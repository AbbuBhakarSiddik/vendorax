import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../../store/useCartStore'

const Cart = () => {
  const { items, removeFromCart, updateQty, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center px-6">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
          <span className="text-4xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">Looks like you haven't added any products yet. Start exploring!</p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          Browse marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} · ₹{getTotal().toLocaleString()} total
            </p>
          </div>
          <button onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => (
              <div key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex gap-4 card-hover stagger-child group"
                style={{ animationDelay: `${i * 80}ms` }}>

                {/* Product image */}
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shrink-0 flex items-center justify-center">
                    <span className="text-gray-300 text-2xl">📦</span>
                  </div>
                )}

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                        {item.name}
                      </h3>
                      {item.storeId && (
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                          {item.storeId.storeName}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-gray-800 text-sm shrink-0">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-purple-600 font-semibold text-xs mt-1">
                    ₹{item.price?.toLocaleString()} each
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <button
                        onClick={() => {
                          if (item.qty === 1) removeFromCart(item._id)
                          else updateQty(item._id, item.qty - 1)
                        }}
                        className="px-3 py-1.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 text-sm font-medium">
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold text-gray-800 min-w-[36px] text-center border-x border-gray-100 bg-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}
                        className="px-3 py-1.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 text-sm font-medium">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 animate-slide-in-right animation-delay-200">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-xl shadow-purple-500/[0.03]">
              <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h2>

              <div className="space-y-2.5 mb-5">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-xs text-gray-500 py-1">
                    <span className="line-clamp-1 flex-1 mr-3">{item.name} × {item.qty}</span>
                    <span className="shrink-0 font-medium text-gray-600">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Subtotal</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <span>Delivery</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-lg">
                  <span>Total</span>
                  <span className="text-purple-700">₹{getTotal().toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Proceed to checkout
              </button>

              <Link to="/"
                className="block text-center text-xs text-purple-600 hover:text-purple-700 font-medium mt-4 transition-colors group">
                <span className="group-hover:underline">Continue shopping</span>
                <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart