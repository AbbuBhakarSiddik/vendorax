import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStore } from '../../../api/store'

const CreateStore = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ storeName: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createStore(form)
      navigate('/seller/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  const slug = form.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div className="min-h-screen bg-[#f8f7fa] flex items-center justify-center px-4">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <span className="text-3xl">🏪</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create your store</h1>
          <p className="text-gray-400 text-sm mt-1">Set up your store on VendoraX in seconds</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xl shadow-purple-500/[0.03]">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-scale-in">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Store name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input name="storeName" type="text" required value={form.storeName} onChange={handleChange}
                  placeholder="e.g. Fresh Bakes by Priya"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300" />
              </div>
              {form.storeName && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-2">
                  <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  vendorax.app/store/<span className="text-purple-600 font-medium">{slug}</span>
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Store description</label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange}
                placeholder="Tell buyers what your store is about..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 resize-none" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating store...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Create store
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateStore