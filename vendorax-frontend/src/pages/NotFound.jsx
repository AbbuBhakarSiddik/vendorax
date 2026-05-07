import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div className="text-center">
      <p className="text-8xl font-black text-purple-100 mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/"
        className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition">
        Back to marketplace
      </Link>
    </div>
  </div>
)

export default NotFound
