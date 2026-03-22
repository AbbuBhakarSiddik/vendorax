import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStoreBySlug } from '../../../api/store'
import { getProductsByStore } from '../../../api/product'

const StorePage = () => {
  const { slug } = useParams()
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadStore = async () => {
      try {
        const [storeRes, productsRes] = await Promise.all([
          getStoreBySlug(slug),
          getProductsByStore(slug)
        ])
        setStore(storeRes.data.store)
        setProducts(productsRes.data.products)
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadStore()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-48 bg-gray-200 rounded-2xl mb-6" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-5xl mb-4">🏪</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Store not found</h2>
        <p className="text-gray-500 text-sm mb-6">This store doesn't exist or has been removed</p>
        <Link to="/" className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-purple-700 transition">
          Back to marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Store banner */}
      <div className="relative">
        {store.banner ? (
          <img src={store.banner} alt="banner"
            className="w-full h-52 object-cover" />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-purple-500 to-purple-700" />
        )}

        {/* Store info overlay */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative -mt-10 flex items-end gap-4 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
              {store.logo ? (
                <img src={store.logo} alt="logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-purple-600">
                  {store.storeName[0]}
                </span>
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-gray-800">{store.storeName}</h1>
              <p className="text-gray-500 text-xs">
                vendorax.app/store/{store.storeSlug}
              </p>
            </div>
          </div>
          {store.description && (
            <p className="text-gray-600 text-sm mb-6 max-w-2xl">{store.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800">
            Products
            <span className="text-gray-400 font-normal ml-2 text-sm">
              {products.length} item{products.length !== 1 ? 's' : ''}
            </span>
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-gray-400 text-sm">No products in this store yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p._id} to={`/product/${p._id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group">
                {p.images && p.images.length > 0 ? (
                  <img src={p.images[0]} alt={p.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition duration-300" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-xs leading-tight line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="text-purple-700 font-bold text-sm mt-1">₹{p.price}</p>
                  <span className={`text-xs font-medium mt-1 inline-block ${p.stock > 5 ? 'text-teal-600'
                    : p.stock > 0 ? 'text-amber-600'
                      : 'text-red-500'
                    }`}>
                    {p.stock > 5 ? 'In stock'
                      : p.stock > 0 ? `Only ${p.stock} left`
                        : 'Out of stock'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default StorePage