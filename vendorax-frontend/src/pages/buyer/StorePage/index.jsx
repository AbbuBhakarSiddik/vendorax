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
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="h-56 bg-gradient-to-br from-purple-200 to-violet-100 animate-pulse" />
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="flex items-end gap-4 mb-8 animate-pulse">
          <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg" />
          <div className="pb-1">
            <div className="h-6 bg-gray-200 rounded-lg w-40 mb-2" />
            <div className="h-3 bg-gray-200 rounded-lg w-56" />
          </div>
        </div>
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center px-6">
      <div className="text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Store not found</h2>
        <p className="text-gray-400 text-sm mb-8">This store doesn't exist or has been removed</p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5">
          Back to marketplace
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f7fa]">

      {/* ─── Store Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {store.banner ? (
          <img src={store.banner} alt="banner"
            className="w-full h-56 md:h-64 object-cover" />
        ) : (
          <div className="w-full h-56 md:h-64 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 animate-gradient relative">
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-10 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl animate-blob animation-delay-400" />
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8f7fa] to-transparent" />
      </div>

      {/* ─── Store Info ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-12 flex items-end gap-4 mb-4 animate-fade-in-up">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white shadow-xl bg-white flex items-center justify-center overflow-hidden shrink-0">
            {store.logo ? (
              <img src={store.logo} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {store.storeName[0]}
                </span>
              </div>
            )}
          </div>
          <div className="pb-2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{store.storeName}</h1>
            <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              vendorax.app/store/{store.storeSlug}
            </p>
          </div>
        </div>

        {store.description && (
          <p className="text-gray-500 text-sm mb-8 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-100">
            {store.description}
          </p>
        )}
      </div>

      {/* ─── Products ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up animation-delay-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-white text-sm">📦</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Products</h2>
            <p className="text-xs text-gray-400">
              {products.length} item{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-gray-500 font-medium text-sm">No products in this store yet</p>
            <p className="text-gray-400 text-xs mt-1">Check back later for new arrivals</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <Link key={p._id} to={`/product/${p._id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover stagger-child"
                style={{ animationDelay: `${i * 60}ms` }}>
                <div className="relative overflow-hidden">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                      <span className="text-gray-300 text-3xl">📦</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Quick view */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-xs bg-white/90 backdrop-blur-sm text-purple-700 font-medium px-2.5 py-1 rounded-lg shadow-sm">View →</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 text-xs leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-purple-700 font-bold text-sm">₹{p.price?.toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.stock > 5 ? 'text-emerald-600 bg-emerald-50'
                      : p.stock > 0 ? 'text-amber-600 bg-amber-50'
                        : 'text-red-500 bg-red-50'
                      }`}>
                      {p.stock > 5 ? 'In stock'
                        : p.stock > 0 ? `${p.stock} left`
                          : 'Sold out'}
                    </span>
                  </div>
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