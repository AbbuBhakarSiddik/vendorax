import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getSingleProduct } from '../../../api/product'
import useCartStore from '../../../store/useCartStore'
import useAuthStore from '../../../store/useAuthStore'

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const { addToCart } = useCartStore()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getSingleProduct(id)
      .then(res => setProduct(res.data.product))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addToCart({ ...product, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="h-96 bg-white rounded-2xl border border-gray-100" />
          <div className="space-y-4 pt-4">
            <div className="h-5 bg-gray-100 rounded-lg w-20" />
            <div className="h-8 bg-gray-100 rounded-lg w-3/4" />
            <div className="h-4 bg-gray-100 rounded-lg w-1/3" />
            <div className="h-12 bg-gray-100 rounded-lg w-1/3 mt-4" />
            <div className="h-20 bg-gray-100 rounded-lg w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center px-6">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
        <p className="text-gray-400 text-sm mb-8">This product doesn't exist or has been removed</p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
          Back to marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 animate-fade-in">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {product.storeId && (
            <>
              <Link to={`/store/${product.storeId.storeSlug}`}
                className="hover:text-purple-600 transition-colors">
                {product.storeId.storeName}
              </Link>
              <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
          <span className="text-gray-600 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* ─── Images ──────────────────────────────────────────── */}
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl shadow-purple-500/[0.03] group">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]} alt={product.name}
                  className="w-full h-72 sm:h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-72 sm:h-80 md:h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-300 text-5xl">📦</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden transition-all duration-200 ${selectedImage === i
                      ? 'ring-2 ring-purple-500 ring-offset-2 scale-105'
                      : 'border-2 border-gray-100 hover:border-purple-200 opacity-70 hover:opacity-100'
                      }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Product Info ─────────────────────────────────────── */}
          <div className="animate-fade-in-up animation-delay-200">
            {/* Category badge */}
            {product.category && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {product.category}
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-3 mb-1 leading-tight">{product.name}</h1>

            {product.storeId && (
              <Link to={`/store/${product.storeId.storeSlug}`}
                className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors group">
                <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                  {product.storeId.storeName[0]}
                </div>
                {product.storeId.storeName}
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-3xl font-black bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                ₹{product.price?.toLocaleString()}
              </p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 5 ? 'bg-emerald-50 text-emerald-600'
                : product.stock > 0 ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-500'
                }`}>
                {product.stock > 5 ? `✓ ${product.stock} in stock`
                  : product.stock > 0 ? `⚡ Only ${product.stock} left`
                    : '✕ Out of stock'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-5 p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag}
                    className="text-xs bg-white text-gray-500 border border-gray-100 px-3 py-1.5 rounded-full hover:border-purple-200 hover:text-purple-600 transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Actions */}
            {product.stock > 0 && (
              <div className="mt-8 space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700">Quantity</label>
                  <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-4 py-2.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all text-sm font-medium">
                      −
                    </button>
                    <span className="px-5 py-2.5 text-sm font-bold text-gray-800 min-w-[48px] text-center border-x border-gray-100 bg-white">
                      {qty}
                    </span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="px-4 py-2.5 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all text-sm font-medium">
                      +
                    </button>
                  </div>
                </div>

                {/* Add to cart button */}
                <button onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${added
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:from-violet-700 hover:to-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0'
                    }`}>
                  {added ? (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to cart!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      Add to cart
                    </>
                  )}
                </button>

                {/* View cart link */}
                <Link to="/cart"
                  className="block w-full py-3.5 rounded-xl text-sm font-semibold text-center border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200">
                  View cart
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage