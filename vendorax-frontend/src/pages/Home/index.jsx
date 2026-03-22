import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFeaturedStores, getAllStores } from '../../api/store'
import { getTrendingProducts, searchProducts } from '../../api/product'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Bakery', 'Handmade', 'Books']

const Home = () => {
  const navigate = useNavigate()
  const [featuredStores, setFeaturedStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, stores, trending] = await Promise.all([
          getFeaturedStores(),
          getAllStores(),
          getTrendingProducts()
        ])
        setFeaturedStores(featured.data.stores)
        setAllStores(stores.data.stores)
        setTrendingProducts(trending.data.products)
      } catch {
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await searchProducts({ q: searchQuery })
      setSearchResults(res.data.products)
    } catch {
    } finally {
      setSearching(false)
    }
  }

  const handleCategory = async (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
    setSearchResults([])
    if (cat === 'All') {
      const res = await getAllStores()
      setAllStores(res.data.stores)
    } else {
      const res = await searchProducts({ category: cat })
      setSearchResults(res.data.products)
    }
  }

  const displayProducts = searchResults.length > 0 || searchQuery
    ? searchResults
    : trendingProducts

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">
            Discover local stores, buy direct
          </h1>
          <p className="text-purple-200 text-lg mb-8">
            Shop from independent sellers — fashion, electronics and more
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!e.target.value) setSearchResults([])
              }}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button type="submit" disabled={searching}
              className="bg-white text-purple-700 font-medium px-6 py-3 rounded-xl text-sm hover:bg-purple-50 transition disabled:opacity-60">
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                ${activeCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured stores */}
        {featuredStores.length > 0 && activeCategory === 'All' && !searchQuery && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Featured stores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredStores.map(store => (
                <Link key={store._id} to={`/store/${store.storeSlug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition hover:border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                    <span className="text-purple-600 font-bold text-lg">
                      {store.storeName[0]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm">{store.storeName}</h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{store.description}</p>
                  <span className="text-xs text-purple-600 mt-3 inline-block font-medium">
                    Visit store →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All stores */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-lg font-bold text-gray-800 mb-4">All stores</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : allStores.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-400 text-sm">No stores yet — be the first to open one!</p>
                <Link to="/register"
                  className="mt-3 inline-block text-sm text-purple-600 font-medium hover:underline">
                  Start selling →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allStores.map(store => (
                  <Link key={store._id} to={`/store/${store.storeSlug}`}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition hover:border-purple-200">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                      <span className="text-gray-600 font-bold text-lg">
                        {store.storeName[0]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm">{store.storeName}</h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{store.description}</p>
                    <span className="text-xs text-purple-600 mt-3 inline-block font-medium">
                      Visit store →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending / search results */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {searchQuery
              ? `Results for "${searchQuery}"`
              : activeCategory !== 'All'
                ? `${activeCategory} products`
                : 'Trending products'
            }
          </h2>
          {displayProducts.length === 0 && !loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map(p => (
                <Link key={p._id} to={`/product/${p._id}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 text-xs leading-tight line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="text-purple-700 font-bold text-sm mt-1">₹{p.price}</p>
                    {p.storeId && (
                      <p className="text-gray-400 text-xs mt-1">{p.storeId.storeName}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-16 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-purple-600 font-bold text-lg">VendoraX</span>
          <p className="text-gray-400 text-xs">
            Empowering local sellers · Built with AI
          </p>
          <Link to="/register"
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
            Start selling
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Home