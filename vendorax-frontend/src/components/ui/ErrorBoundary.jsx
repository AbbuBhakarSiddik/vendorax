import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production you'd send this to Sentry/LogRocket etc.
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">
              An unexpected error occurred. Please refresh the page or go back home.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-purple-700 transition">
                Refresh page
              </button>
              <a href="/"
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
                Go home
              </a>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
