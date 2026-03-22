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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-5xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Product not found</h2>
        <Link to="/" className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition">
          Back to marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          {product.storeId && (
            <>
              <Link to={`/store/${product.storeId.storeSlug}`}
                className="hover:text-purple-600">
                {product.storeId.storeName}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-600">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-3">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]} alt={product.name}
                  className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition ${selectedImage === i ? 'border-purple-500' : 'border-gray-200'
                      }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-1">{product.name}</h1>

            {product.storeId && (
              <Link to={`/store/${product.storeId.storeSlug}`}
                className="text-xs text-purple-600 hover:underline">
                by {product.storeId.storeName}
              </Link>
            )}

            <p className="text-3xl font-bold text-purple-700 mt-4">₹{product.price}</p>

            <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-2 ${product.stock > 5 ? 'bg-teal-50 text-teal-700'
              : product.stock > 0 ? 'bg-amber-50 text-amber-700'
                : 'bg-red-50 text-red-600'
              }`}>
              {product.stock > 5 ? `${product.stock} in stock`
                : product.stock > 0 ? `Only ${product.stock} left`
                  : 'Out of stock'}
            </span>

            {product.description && (
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                {product.description}
              </p>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag}
                    className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to cart */}
            {product.stock > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Quantity</label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-sm">
                      −
                    </button>
                    <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">
                      {qty}
                    </span>
                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition text-sm">
                      +
                    </button>
                  </div>
                </div>

                <button onClick={handleAddToCart}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition ${added
                    ? 'bg-teal-500 text-white'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                  {added ? '✓ Added to cart' : 'Add to cart'}
                </button>

                <Link to="/cart"
                  className="block w-full py-3 rounded-xl text-sm font-medium text-center border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition">
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