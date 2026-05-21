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

  const handleDescription = async (e) => { e.preventDefault(); setDescLoading(true); setError(''); setDescResult(''); try { const r = await generateDescription(descForm); setDescResult(r.data.description) } catch { setError('Failed to generate description') } finally { setDescLoading(false) } }
  const handleTags = async (e) => { e.preventDefault(); setTagsLoading(true); setError(''); setTagsResult(null); try { const r = await generateTags(tagsForm); setTagsResult(r.data) } catch { setError('Failed to generate tags') } finally { setTagsLoading(false) } }
  const handlePricing = async (e) => { e.preventDefault(); setPricingLoading(true); setError(''); setPricingResult(null); try { const r = await getPricingSuggestion(pricingForm); setPricingResult(r.data) } catch { setError('Failed to get pricing suggestion') } finally { setPricingLoading(false) } }
  const copyToClipboard = (text) => navigator.clipboard.writeText(text)

  const tabs = [{ id: 'description', label: 'Description', icon: '📝' }, { id: 'tags', label: 'Tags & Category', icon: '🏷️' }, { id: 'pricing', label: 'Smart Pricing', icon: '💰' }]
  const ic = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all duration-200 bg-gray-50/50 hover:bg-white hover:border-gray-300"

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20"><span className="text-white text-lg">✨</span></div>
            <div><h1 className="text-2xl font-bold text-gray-800">AI Tools</h1><p className="text-gray-400 text-sm">Powered by Gemini — generate descriptions, tags, and pricing</p></div>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl mb-8 animate-fade-in-up animation-delay-100">
          {tabs.map(tab => (<button key={tab.id} onClick={() => { setActiveTab(tab.id); setError('') }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><span>{tab.icon}</span><span className="hidden sm:inline">{tab.label}</span></button>))}
        </div>

        {error && (<div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-scale-in"><svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-red-600 text-sm">{error}</p></div>)}

        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><span className="text-white text-xs">📝</span></div><h2 className="font-bold text-gray-800">Product Description Generator</h2></div>
            <p className="text-gray-400 text-xs mb-5 ml-9">Enter product name and features — AI writes a compelling description</p>
            <form onSubmit={handleDescription} className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Product name</label><input value={descForm.productName} onChange={e => setDescForm({ ...descForm, productName: e.target.value })} required placeholder="e.g. Handmade Chocolate Cake" className={ic} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Key features</label><textarea value={descForm.features} onChange={e => setDescForm({ ...descForm, features: e.target.value })} required rows={3} placeholder="e.g. Dark chocolate, handmade, no preservatives" className={`${ic} resize-none`} /></div>
              <button type="submit" disabled={descLoading} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2">
                {descLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>) : '✨ Generate description'}
              </button>
            </form>
            {descResult && (<div className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl animate-scale-in"><div className="flex items-center justify-between mb-3"><p className="text-xs font-bold text-purple-700">Generated description</p><button onClick={() => copyToClipboard(descResult)} className="text-xs text-purple-600 hover:text-purple-700 font-semibold">Copy</button></div><p className="text-sm text-gray-700 leading-relaxed">{descResult}</p></div>)}
          </div>
        )}

        {activeTab === 'tags' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"><span className="text-white text-xs">🏷️</span></div><h2 className="font-bold text-gray-800">Tags & Category Suggester</h2></div>
            <p className="text-gray-400 text-xs mb-5 ml-9">AI suggests the best tags and category for your product</p>
            <form onSubmit={handleTags} className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Product name</label><input value={tagsForm.productName} onChange={e => setTagsForm({ ...tagsForm, productName: e.target.value })} required placeholder="e.g. Wireless Gaming Headphones" className={ic} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description <span className="text-gray-400 font-normal">(optional)</span></label><textarea value={tagsForm.description} onChange={e => setTagsForm({ ...tagsForm, description: e.target.value })} rows={2} placeholder="Brief product description..." className={`${ic} resize-none`} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Current category <span className="text-gray-400 font-normal">(optional)</span></label><input value={tagsForm.category} onChange={e => setTagsForm({ ...tagsForm, category: e.target.value })} placeholder="e.g. Electronics" className={ic} /></div>
              <button type="submit" disabled={tagsLoading} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2">
                {tagsLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>) : '✨ Generate tags'}
              </button>
            </form>
            {tagsResult && (<div className="mt-6 space-y-4 animate-scale-in"><div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl"><p className="text-xs font-bold text-purple-700 mb-3">Suggested tags</p><div className="flex flex-wrap gap-2">{tagsResult.tags.map(tag => (<span key={tag} className="text-xs bg-white text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full font-medium shadow-sm">#{tag}</span>))}</div><button onClick={() => copyToClipboard(tagsResult.tags.join(', '))} className="text-xs text-purple-600 hover:text-purple-700 font-semibold mt-3 inline-block">Copy all tags</button></div><div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl"><p className="text-xs font-bold text-emerald-700 mb-1">Suggested category</p><p className="text-sm font-bold text-gray-800">{tagsResult.category}</p></div></div>)}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl shadow-purple-500/[0.03] animate-fade-in-up">
            <div className="flex items-center gap-2 mb-1"><div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"><span className="text-white text-xs">💰</span></div><h2 className="font-bold text-gray-800">Smart Pricing Suggestion</h2></div>
            <p className="text-gray-400 text-xs mb-5 ml-9">AI suggests an optimal price based on your product and market</p>
            <form onSubmit={handlePricing} className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Product name</label><input value={pricingForm.productName} onChange={e => setPricingForm({ ...pricingForm, productName: e.target.value })} required placeholder="e.g. Handmade Leather Wallet" className={ic} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label><input value={pricingForm.category} onChange={e => setPricingForm({ ...pricingForm, category: e.target.value })} placeholder="e.g. Fashion" className={ic} /></div>
              <div><label className="text-xs font-semibold text-gray-600 mb-1.5 block">Current price (₹)</label><input type="number" min="0" value={pricingForm.currentPrice} onChange={e => setPricingForm({ ...pricingForm, currentPrice: e.target.value })} required placeholder="0" className={ic} /></div>
              <button type="submit" disabled={pricingLoading} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2">
                {pricingLoading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing...</>) : '✨ Get price suggestion'}
              </button>
            </form>
            {pricingResult && (<div className="mt-6 space-y-4 animate-scale-in"><div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl text-center"><p className="text-xs font-bold text-amber-700 mb-2">Suggested price</p><p className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">₹{pricingResult.suggestedPrice.toLocaleString()}</p></div><div className="p-5 bg-gray-50 border border-gray-100 rounded-xl"><p className="text-xs font-bold text-gray-500 mb-2">Reasoning</p><p className="text-sm text-gray-600 leading-relaxed">{pricingResult.reason}</p></div></div>)}
          </div>
        )}
      </div>
    </div>
  )
}

export default AITools