import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center px-6">
    <div className="text-center animate-fade-in-up">
      {/* Animated 404 */}
      <div className="relative mb-8">
        <p className="text-[120px] md:text-[160px] font-black leading-none select-none bg-gradient-to-b from-purple-200 to-purple-50 bg-clip-text text-transparent">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 animate-float">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or has been moved to a new location.
      </p>
      <Link to="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-7 py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Back to marketplace
      </Link>
    </div>
  </div>
)

export default NotFound
