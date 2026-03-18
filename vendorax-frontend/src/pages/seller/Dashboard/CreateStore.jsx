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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create your store</h1>
        <p className="text-gray-500 text-sm mb-6">Set up your store on VendoraX in seconds</p>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Store name</label>
            <input name="storeName" type="text" required value={form.storeName} onChange={handleChange}
              placeholder="e.g. Fresh Bakes by Priya"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            {form.storeName && (
              <p className="text-xs text-gray-400 mt-1">
                Your store URL: vendorax.app/store/{form.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Store description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange}
              placeholder="Tell buyers what your store is about..."
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-60">
            {loading ? 'Creating store...' : 'Create store'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateStore