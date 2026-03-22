import { Link, useNavigate } from 'react-router-dom'
import useCartStore from '../../../store/useCartStore'

const Cart = () => {
  const { items, removeFromCart, updateQty, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add some products to get started</p>
        <Link to="/"
          className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition">
          Browse marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Your cart
            <span className="text-gray-400 font-normal text-base ml-2">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </h1>
          <button onClick={clearCart}
            className="text-sm text-red-500 hover:underline">
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item._id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0]} alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No img</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                    {item.name}
                  </h3>
                  {item.storeId && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      {item.storeId.storeName}
                    </p>
                  )}
                  <p className="text-purple-700 font-bold text-sm mt-1">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.qty === 1) removeFromCart(item._id)
                          else updateQty(item._id, item.qty - 1)
                        }}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition text-sm">
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item._id, Math.min(item.stock, item.qty + 1))}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition text-sm">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)}
                      className="text-xs text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-800 text-sm">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <h2 className="font-bold text-gray-800 mb-4">Order summary</h2>

              <div className="space-y-2 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-xs text-gray-500">
                    <span className="line-clamp-1 flex-1 mr-2">{item.name} × {item.qty}</span>
                    <span>₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 mb-5">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>₹{getTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-purple-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition">
                Proceed to checkout
              </button>

              <Link to="/"
                className="block text-center text-xs text-purple-600 hover:underline mt-3">
                Continue shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart