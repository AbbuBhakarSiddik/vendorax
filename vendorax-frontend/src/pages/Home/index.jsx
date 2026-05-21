import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getFeaturedStores, getAllStores } from '../../api/store'
import { getTrendingProducts, searchProducts } from '../../api/product'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Bakery', 'Handmade', 'Books']

const CATEGORY_ICONS = {
  All: '🌐', Electronics: '⚡', Fashion: '👗',
  Bakery: '🧁', Handmade: '🎨', Books: '📚'
}

// Modal Components
const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl animate-bounce-in">
        <div className="sticky top-0 bg-gradient-to-r from-brand-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">About VendoraX</h2>
          <button onClick={onClose} className="text-white hover:text-white/80 transition-colors text-2xl">✕</button>
        </div>
        <div className="p-8 space-y-4 text-surface-700 leading-relaxed">
          <p>
            VendoraX is a revolutionary AI-powered marketplace that empowers independent creators, artisans, and entrepreneurs to reach a global audience. Founded in 2024, our mission is to democratize e-commerce and give every seller the tools they need to succeed.
          </p>
          <p>
            We believe that quality products should be accessible to everyone, and talented creators deserve a platform that doesn't take all their profits. Our platform combines intelligent product discovery with powerful seller tools to create the perfect marketplace.
          </p>
          <p className="font-semibold text-brand-600">
            ✨ With VendoraX, sellers get:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>AI-powered product descriptions in seconds</li>
            <li>Real-time analytics to grow your business</li>
            <li>Secure payment processing</li>
            <li>Global reach to millions of buyers</li>
            <li>24/7 support and community</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-bounce-in">
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Contact Us</h2>
          <button onClick={onClose} className="text-white hover:text-white/80 transition-colors text-2xl">✕</button>
        </div>
        <div className="p-8 space-y-6">
          <div className="bg-brand-50 rounded-xl p-4 border-2 border-brand-200">
            <p className="text-sm text-surface-500 font-medium mb-2">Email</p>
            <a href="mailto:support@vendorax.com" className="text-lg font-bold text-brand-600 hover:text-brand-700 flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@vendorax.com
            </a>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm text-surface-500 font-medium mb-2">Phone</p>
            <a href="tel:+919876543210" className="text-lg font-bold text-purple-600 hover:text-purple-700 flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.75h2.048a1 1 0 00.948-.684l1.498-4.493a1 1 0 00.502-.75h2.044a2 2 0 012 2v2a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
              </svg>
              +91 98765 43210
            </a>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm text-surface-500 font-medium mb-2">Business Hours</p>
            <p className="text-sm font-semibold text-blue-700">Monday - Friday: 9 AM - 6 PM IST</p>
            <p className="text-sm font-semibold text-blue-700">Saturday - Sunday: 10 AM - 4 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl animate-bounce-in">
        <div className="sticky top-0 bg-gradient-to-r from-brand-600 to-purple-600 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">Terms & Privacy Policy</h2>
          <button onClick={onClose} className="text-white hover:text-white/80 transition-colors text-2xl">✕</button>
        </div>
        <div className="p-8 space-y-4 text-surface-700 leading-relaxed">
          <div>
            <h3 className="font-bold text-lg text-surface-900 mb-2">Terms of Service</h3>
            <p>
              By using VendoraX, you agree to comply with our terms. Users must be 18+ or have parental consent. All transactions are final and refunds follow seller policies. We are not responsible for third-party content or disputes between buyers and sellers.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-surface-900 mb-2">Privacy Policy</h3>
            <p>
              Your privacy matters to us. We collect only necessary information to provide our services. Your data is encrypted and never shared with third parties without consent. Cookies help improve your experience. You can request data deletion anytime.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-surface-900 mb-2">User Responsibilities</h3>
            <p>
              Users must provide accurate information, respect intellectual property, avoid harassment, and follow all platform rules. Violating terms may result in account suspension or permanent ban.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [focusedSearch, setFocusedSearch] = useState(false)
  const [modalState, setModalState] = useState({ about: false, contact: false, terms: false })

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
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-brand-50/30 to-surface-50 overflow-hidden">
      <style>{`
        @keyframes float-smooth {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }

        @keyframes float-smooth-delayed {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(15px) translateX(-15px); }
          66% { transform: translateY(-15px) translateX(15px); }
        }

        @keyframes float-smooth-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }

        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 0px rgba(168, 85, 247, 0.5); }
          50% { text-shadow: 0 0 20px rgba(168, 85, 247, 0.8); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes stagger-fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .animate-float-smooth { animation: float-smooth 6s ease-in-out infinite; }
        .animate-float-smooth-delayed { animation: float-smooth-delayed 7s ease-in-out infinite; }
        .animate-float-smooth-slow { animation: float-smooth-slow 8s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        
        .animate-stagger-1 { animation: stagger-fade-in-up 0.5s ease-out 0.1s both; }
        .animate-stagger-2 { animation: stagger-fade-in-up 0.5s ease-out 0.2s both; }
        .animate-stagger-3 { animation: stagger-fade-in-up 0.5s ease-out 0.3s both; }
        .animate-stagger-4 { animation: stagger-fade-in-up 0.5s ease-out 0.4s both; }
        .animate-stagger-5 { animation: stagger-fade-in-up 0.5s ease-out 0.5s both; }

        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }

        .product-card-hover { 
          transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .product-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 30px rgba(168, 85, 247, 0.12);
        }

        /* Remove search suggestions box */
        input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }

        input:autofill,
        input:autofill:hover,
        input:autofill:focus,
        input:autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          box-shadow: 0 0 0 30px white inset !important;
        }
      `}</style>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-900" />

        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-float-smooth" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-smooth-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-300/15 rounded-full blur-3xl animate-float-smooth-slow" />

        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="animate-stagger-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">✨ AI-Powered Marketplace</span>
          </div>

          <div className="animate-stagger-2 mb-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight tracking-tight">
              <span className="text-white">Discover</span>
              <br />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">Unique Products & Stores</span>
            </h1>
            <p className="text-brand-200/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              Shop from independent creators worldwide. Every product tells a story. Find it here, powered by intelligent discovery.
            </p>
          </div>

          <form onSubmit={handleSearch} className="animate-stagger-3 max-w-3xl mx-auto mb-8">
            <div className={`relative group transition-all duration-500 ${focusedSearch ? 'scale-105' : 'scale-100'}`}>
              <div className={`absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-50 transition-opacity duration-500`} />

              <div className={`relative flex items-center gap-3 bg-white/95 backdrop-blur-xl border-2 rounded-2xl p-2 shadow-2xl shadow-black/20 transition-all duration-300 ${focusedSearch ? 'border-brand-500 bg-white' : 'border-white/30 hover:bg-white/98'}`}>
                <div className="pl-4 text-brand-400">
                  <svg className="w-6 h-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!e.target.value) setSearchResults([])
                  }}
                  onFocus={() => setFocusedSearch(true)}
                  onBlur={() => setFocusedSearch(false)}
                  placeholder="Search products, stores, creators..."
                  className="flex-1 bg-transparent text-surface-900 placeholder-surface-400 px-2 py-4 text-base focus:outline-none font-medium"
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={searching}
                  className="bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold px-8 py-3 rounded-xl text-sm hover:from-brand-600 hover:to-brand-700 transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 m-1 flex items-center gap-2"
                >
                  {searching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Search</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="animate-stagger-4 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white/70 mt-8">
            <div className="text-center group">
              <p className="text-3xl md:text-4xl font-black text-white group-hover:text-amber-300 transition-colors">{allStores.length || '—'}</p>
              <p className="text-xs mt-2 font-medium">Active Stores</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center group">
              <p className="text-3xl md:text-4xl font-black text-white group-hover:text-amber-300 transition-colors">{trendingProducts.length || '—'}</p>
              <p className="text-xs mt-2 font-medium">Products Listed</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center group">
              <p className="text-3xl md:text-4xl font-black text-white group-hover:text-amber-300 transition-colors">∞</p>
              <p className="text-xs mt-2 font-medium">Possibilities</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full text-surface-50" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,64L120,80C240,96,480,128,720,122.7C960,117,1200,75,1320,53.3L1440,32L1440,120L0,120Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">

        {/* ─── Categories ────────────────────────────────────────────── */}
        <div className="animate-stagger-2 mb-16">
          <h3 className="text-sm font-bold text-surface-500 uppercase tracking-widest mb-4">Browse Categories</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border-2 animate-bounce-in`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {activeCategory === cat ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 border-0">
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <span>{cat}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-white text-surface-700 border-2 border-surface-200 rounded-xl hover:border-brand-300 hover:text-brand-600 hover:shadow-md transition-all">
                    <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                    <span>{cat}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Featured Stores ───────────────────────────────────────── */}
        {featuredStores.length > 0 && activeCategory === 'All' && !searchQuery && (
          <div className="mb-20 animate-stagger-3">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-white text-lg">⭐</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-surface-900">Featured Stores</h2>
                <p className="text-sm text-surface-500 font-medium mt-1">Curated sellers you'll love</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStores.map((store, i) => (
                <Link key={store._id} to={`/store/${store.storeSlug}`}
                  className="group bg-white rounded-2xl border-2 border-surface-100 p-6 product-card-hover animate-bounce-in"
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border-2 border-brand-200">
                      <span className="text-brand-700 font-black text-xl">{store.storeName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-surface-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">{store.storeName}</h3>
                      <p className="text-surface-500 text-sm mt-1 line-clamp-2 leading-relaxed">{store.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-surface-50">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">Featured</span>
                    <span className="text-xs text-brand-600 font-bold group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                      Visit
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── All Stores ────────────────────────────────────────────── */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="mb-20 animate-stagger-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <span className="text-white text-lg">🏪</span>
              </div>
              <div>
                <h2 className="text-3xl font-black text-surface-900">All Stores</h2>
                <p className="text-sm text-surface-500 font-medium mt-1">Explore independent sellers</p>
              </div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl border-2 border-surface-100 p-6 animate-pulse">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-surface-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-100 rounded-lg w-2/3" />
                        <div className="h-3 bg-surface-100 rounded-lg w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : allStores.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-surface-200 p-20 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-purple-50 flex items-center justify-center">
                  <span className="text-5xl">🏪</span>
                </div>
                <p className="text-surface-700 font-bold text-lg">No stores yet</p>
                <p className="text-surface-500 text-sm mt-2 mb-6">Be the first to open your store on VendoraX</p>
                <Link to="/register"
                  className="inline-flex items-center gap-2 text-sm text-white font-bold bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 rounded-xl hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all hover:-translate-y-0.5">
                  Start selling today
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allStores.map((store, i) => (
                  <Link key={store._id} to={`/store/${store.storeSlug}`}
                    className="group bg-white rounded-2xl border-2 border-surface-100 p-6 product-card-hover animate-bounce-in"
                    style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center shrink-0 group-hover:from-brand-100 group-hover:to-purple-100 transition-all duration-300 group-hover:scale-110 border-2 border-surface-200 group-hover:border-brand-200">
                        <span className="text-surface-600 group-hover:text-brand-600 font-bold text-xl transition-colors">{store.storeName[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-surface-900 text-base group-hover:text-brand-600 transition-colors line-clamp-1">{store.storeName}</h3>
                        <p className="text-surface-500 text-sm mt-1 line-clamp-2 leading-relaxed">{store.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Products Grid - SMALLER CARDS ─────────────────────────────────────────── */}
        <div className="animate-stagger-5">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${searchQuery
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30'
              : 'bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30'
              }`}>
              <span className="text-white text-lg">{searchQuery ? '🔍' : '🔥'}</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-surface-900">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : activeCategory !== 'All'
                    ? `${activeCategory} Collection`
                    : 'Trending Right Now'
                }
              </h2>
              <p className="text-sm text-surface-500 font-medium mt-1">
                {searchQuery ? 'Matching your search' : 'Most loved items this week'}
              </p>
            </div>
          </div>

          {displayProducts.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-surface-200 p-20 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                <span className="text-5xl">🔍</span>
              </div>
              <p className="text-surface-700 font-bold text-lg">No products found</p>
              <p className="text-surface-500 text-sm mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayProducts.map((p, i) => (
                <Link key={p._id} to={`/product/${p._id}`}
                  className="group bg-white rounded-xl border-2 border-surface-100 overflow-hidden product-card-hover animate-bounce-in"
                  style={{ animationDelay: `${i * 0.03}s` }}>

                  {/* Image section */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-surface-50 to-surface-100 h-48">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0]} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl text-surface-200">📦</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content section */}
                  <div className="p-3.5 space-y-3">
                    <h3 className="font-bold text-surface-900 text-sm leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-brand-600 font-black text-base">₹{p.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ─── Special Interactive Bottom Section ───────────────────────────────────────── */}
      <div className="relative mt-24 py-20 bg-gradient-to-r from-brand-600 via-purple-600 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-20 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl animate-float-smooth"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-smooth-delayed"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left side - Content */}
            <div className="animate-stagger-1">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-ring" />
                <span className="text-white/90 text-xs font-bold">Join Our Community</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">start selling</span>?
              </h2>

              <p className="text-brand-200/90 text-lg leading-relaxed mb-8">
                Join thousands of successful sellers on VendoraX. Get AI-powered tools, real analytics, and a global audience. Your success story starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=seller"
                  className="group inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-amber-50 shadow-2xl shadow-black/30 hover:shadow-amber-300/50 transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
                  Start Your Store
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                <button
                  onClick={() => navigate('/login')}
                  className="group inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
                  Explore Products
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              {/* Features list */}
              <div className="mt-10 space-y-3">
                {[
                  { icon: '🎯', text: 'Reach buyers worldwide' },
                  { icon: '💡', text: 'Intelligent product tools' },
                  { icon: '💪', text: 'Grow your business with us' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-white/90 animate-stagger-2" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Interactive Cards */}
            <div className="animate-stagger-2 relative space-y-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-black/30 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🌟</div>
                  <div>
                    <h3 className="text-white font-black text-lg">Easy Setup</h3>
                    <p className="text-white/70 text-sm mt-1">Launch your store in just 5 minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-black/30 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">📱</div>
                  <div>
                    <h3 className="text-white font-black text-lg">Mobile Friendly</h3>
                    <p className="text-white/70 text-sm mt-1">Manage your store from anywhere, anytime</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-black/30 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎁</div>
                  <div>
                    <h3 className="text-white font-black text-lg">Better Earnings</h3>
                    <p className="text-white/70 text-sm mt-1">Keep more of what you earn with low fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t-2 border-surface-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <span className="text-white font-black text-lg">V</span>
                </div>
                <div>
                  <p className="font-black text-lg text-brand-600">VendoraX</p>
                  <p className="text-xs text-surface-500 font-bold">Empowering Creators</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold text-surface-900 mb-3 text-sm">Company</p>
              <div className="space-y-2">
                <button
                  onClick={() => setModalState({ ...modalState, about: true })}
                  className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium block">
                  About Us
                </button>
                <button
                  onClick={() => setModalState({ ...modalState, contact: true })}
                  className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium block">
                  Contact Us
                </button>
                <button
                  onClick={() => setModalState({ ...modalState, terms: true })}
                  className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium block">
                  Terms & Privacy
                </button>
              </div>
            </div>
            <div>
              <p className="font-bold text-surface-900 mb-3 text-sm">For Sellers</p>
              <div className="space-y-2">
                <Link to="#" className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium">Pricing</Link>
                <Link to="#" className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium">Features</Link>
                <Link to="/register?role=seller" className="text-sm text-surface-600 hover:text-brand-600 transition-colors font-medium">Start Selling</Link>
              </div>
            </div>
            <div>
              <p className="font-bold text-surface-900 mb-3 text-sm">Connect</p>
              <div className="flex items-center gap-3">
                {['f', 't', 'in', 'ig'].map(social => (
                  <button key={social} className="w-10 h-10 rounded-lg bg-surface-100 text-surface-600 hover:bg-brand-500 hover:text-white transition-all duration-300 flex items-center justify-center font-bold text-sm">
                    {social}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-surface-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-500 font-medium">© 2026 VendoraX. All rights reserved. • Empowering independent creators worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal isOpen={modalState.about} onClose={() => setModalState({ ...modalState, about: false })} />
      <ContactModal isOpen={modalState.contact} onClose={() => setModalState({ ...modalState, contact: false })} />
      <TermsModal isOpen={modalState.terms} onClose={() => setModalState({ ...modalState, terms: false })} />

    </div>
  )
}

export default Home