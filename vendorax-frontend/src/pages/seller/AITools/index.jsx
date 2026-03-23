import { useState } from 'react'
import { generateDescription, generateTags, getPricingSuggestion } from '../../../api/ai'

const AITools = () => {
  const [activeTab, setActiveTab] = useState('description')

  const [descForm, setDescForm] = useState({ productName: '', features: '' })
  const [descResult, setDescResult] = useState('')
  const [descLoading, setDescLoading] = useState(false)

  const [tagsForm, setTagsForm] = useState({ productName: '', description: '', category: '' })
  const [tagsResult, setTagsResult] = useState(null)
  const [tagsLoading, setTagsLoading] = useState(false)

  const [pricingForm, setPricingForm] = useState({ productName: '', category: '', currentPrice: '' })
  const [pricingResult, setPricingResult] = useState(null)
  const [pricingLoading, setPricingLoading] = useState(false)

  const [error, setError] = useState('')

  const handleDescription = async (e) => {
    e.preventDefault()
    setDescLoading(true)
    setError('')
    setDescResult('')
    try {
      const res = await generateDescription(descForm)
      setDescResult(res.data.description)
    } catch {
      setError('Failed to generate description')
    } finally {
      setDescLoading(false)
    }
  }

  const handleTags = async (e) => {
    e.preventDefault()
    setTagsLoading(true)
    setError('')
    setTagsResult(null)
    try {
      const res = await generateTags(tagsForm)
      setTagsResult(res.data)
    } catch {
      setError('Failed to generate tags')
    } finally {
      setTagsLoading(false)
    }
  }

  const handlePricing = async (e) => {
    e.preventDefault()
    setPricingLoading(true)
    setError('')
    setPricingResult(null)
    try {
      const res = await getPricingSuggestion(pricingForm)
      setPricingResult(res.data)
    } catch {
      setError('Failed to get pricing suggestion')
    } finally {
      setPricingLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const tabs = [
    { id: 'description', label: 'Description generator' },
    { id: 'tags', label: 'Tags & category' },
    { id: 'pricing', label: 'Smart pricing' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">AI tools</h1>
          <p className="text-gray-500 text-sm mt-1">
            Powered by Gemini — generate descriptions, tags, and pricing suggestions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError('') }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-6 bg-red-50 p-3 rounded-lg">{error}</p>
        )}

        {/* Description generator */}
        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Product description generator</h2>
            <p className="text-gray-400 text-xs mb-5">
              Enter your product name and key features — AI writes a compelling description
            </p>
            <form onSubmit={handleDescription} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Product name</label>
                <input
                  value={descForm.productName}
                  onChange={e => setDescForm({ ...descForm, productName: e.target.value })}
                  required placeholder="e.g. Handmade Chocolate Cake"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Key features</label>
                <textarea
                  value={descForm.features}
                  onChange={e => setDescForm({ ...descForm, features: e.target.value })}
                  required rows={3} placeholder="e.g. Dark chocolate, handmade, no preservatives, serves 4"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <button type="submit" disabled={descLoading}
                className="bg-purple-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60 flex items-center gap-2">
                {descLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : '✨ Generate description'}
              </button>
            </form>

            {descResult && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-purple-700">Generated description</p>
                  <button onClick={() => copyToClipboard(descResult)}
                    className="text-xs text-purple-600 hover:underline">
                    Copy
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{descResult}</p>
              </div>
            )}
          </div>
        )}

        {/* Tags generator */}
        {activeTab === 'tags' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Tags & category suggester</h2>
            <p className="text-gray-400 text-xs mb-5">
              AI suggests the best tags and category for your product
            </p>
            <form onSubmit={handleTags} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Product name</label>
                <input
                  value={tagsForm.productName}
                  onChange={e => setTagsForm({ ...tagsForm, productName: e.target.value })}
                  required placeholder="e.g. Wireless Gaming Headphones"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={tagsForm.description}
                  onChange={e => setTagsForm({ ...tagsForm, description: e.target.value })}
                  rows={2} placeholder="Brief product description..."
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current category
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <input
                  value={tagsForm.category}
                  onChange={e => setTagsForm({ ...tagsForm, category: e.target.value })}
                  placeholder="e.g. Electronics"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button type="submit" disabled={tagsLoading}
                className="bg-purple-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60 flex items-center gap-2">
                {tagsLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : '✨ Generate tags'}
              </button>
            </form>

            {tagsResult && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                  <p className="text-xs font-medium text-purple-700 mb-3">Suggested tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tagsResult.tags.map(tag => (
                      <span key={tag}
                        className="text-xs bg-white text-purple-700 border border-purple-200 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => copyToClipboard(tagsResult.tags.join(', '))}
                    className="text-xs text-purple-600 hover:underline mt-3 inline-block">
                    Copy all tags
                  </button>
                </div>
                <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                  <p className="text-xs font-medium text-teal-700 mb-1">Suggested category</p>
                  <p className="text-sm font-semibold text-gray-800">{tagsResult.category}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pricing */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">Smart pricing suggestion</h2>
            <p className="text-gray-400 text-xs mb-5">
              AI suggests an optimal price based on your product and market
            </p>
            <form onSubmit={handlePricing} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Product name</label>
                <input
                  value={pricingForm.productName}
                  onChange={e => setPricingForm({ ...pricingForm, productName: e.target.value })}
                  required placeholder="e.g. Handmade Leather Wallet"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input
                  value={pricingForm.category}
                  onChange={e => setPricingForm({ ...pricingForm, category: e.target.value })}
                  placeholder="e.g. Fashion"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Current price (₹)</label>
                <input type="number" min="0"
                  value={pricingForm.currentPrice}
                  onChange={e => setPricingForm({ ...pricingForm, currentPrice: e.target.value })}
                  required placeholder="0"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <button type="submit" disabled={pricingLoading}
                className="bg-purple-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60 flex items-center gap-2">
                {pricingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analysing...
                  </>
                ) : '✨ Get price suggestion'}
              </button>
            </form>

            {pricingResult && (
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs font-medium text-amber-700 mb-1">Suggested price</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ₹{pricingResult.suggestedPrice.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 mb-1">Reasoning</p>
                  <p className="text-sm text-gray-700">{pricingResult.reason}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AITools