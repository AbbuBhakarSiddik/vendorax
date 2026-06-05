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

  const tabs = [
    { id: 'description', label: 'Description', icon: '📝', subtitle: 'AI Writing Tool', desc: 'Craft compelling product descriptions' },
    { id: 'tags', label: 'Tags & Category', icon: '🏷️', subtitle: 'Smart Classification', desc: 'Generate SEO-friendly tags and categories' },
    { id: 'pricing', label: 'Smart Pricing', icon: '💰', subtitle: 'AI Market Analysis', desc: 'Get optimal pricing suggestions' }
  ]

  const inputClasses = "w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200/60 transition-all duration-200 hover:border-gray-300 shadow-sm"

  const aiInsights = {
    description: {
      title: 'AI Description Writer',
      points: ['Generate engaging product descriptions', 'SEO-optimized & marketing ready', 'Trained on high-converting copy']
    },
    tags: {
      title: 'Smart Tag Suggester',
      points: ['Improve product discoverability', 'Auto-generate relevant tags', 'Based on category analysis']
    },
    pricing: {
      title: 'Pricing Intelligence',
      points: ['Market-based price analysis', 'Competitive positioning', 'Maximize revenue & profit']
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-purple-50/30">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float-bounce" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Hero header */}
        <div className="mb-8 animate-fade-in-up text-center sm:text-left">
          <div className="flex items-center gap-3 mb-2 justify-center sm:justify-start">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/25">
              <span className="text-white text-2xl">✨</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                AI Tools
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  AI Powered
                </span>
                <p className="text-gray-500 text-sm">Powered by Gemini — generate descriptions, tags, and pricing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab feature cards (Description / Tags / Pricing) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up animation-delay-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError('') }}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 group ${
                activeTab === tab.id
                  ? 'bg-white border-purple-400 shadow-xl shadow-purple-500/20 scale-[1.02]'
                  : 'bg-white/60 border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-600'
              }`}>
                {tab.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800">{tab.label}</p>
                <p className="text-xs text-gray-500">{tab.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-scale-in">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Tool content with AI insight panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Main tool card */}
          <div className="lg:col-span-2">
            {activeTab === 'description' && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-gray-200 p-6 shadow-xl shadow-purple-500/[0.05]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">Product Description Generator</h2>
                    <p className="text-gray-400 text-xs">AI writes compelling product copy</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 mb-5 ml-12">
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">SEO Friendly</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">AI Generated</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Marketing Optimized</span>
                </div>

                <form onSubmit={handleDescription} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">📦 Product name</label>
                    <input value={descForm.productName} onChange={e => setDescForm({ ...descForm, productName: e.target.value })} required placeholder="e.g. Handmade Chocolate Cake" className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">✨ Key features</label>
                    <textarea value={descForm.features} onChange={e => setDescForm({ ...descForm, features: e.target.value })} required rows={3} placeholder="e.g. Dark chocolate, handmade, no preservatives" className={`${inputClasses} resize-none`} />
                  </div>
                  <button type="submit" disabled={descLoading} className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm px-6 py-3.5 rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2 group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700 opacity-0 group-hover:opacity-100" />
                    {descLoading ? (
                      <span className="relative flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</span>
                    ) : (
                      <span className="relative">✨ Generate description</span>
                    )}
                  </button>
                </form>

                {descResult && (
                  <div className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl animate-scale-in">
                    <span className="inline-block text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-semibold mb-3">🤖 AI Generated Result</span>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-purple-700">Generated description</p>
                      <button onClick={() => copyToClipboard(descResult)} className="text-xs text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2">Copy</button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{descResult}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-gray-200 p-6 shadow-xl shadow-blue-500/[0.05]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <span className="text-white text-lg">🏷️</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">Tags & Category Suggester</h2>
                    <p className="text-gray-400 text-xs">Smart classification for your products</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 mb-5 ml-12">
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Smart Categorization</span>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Discoverability</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Search Optimized</span>
                </div>

                <form onSubmit={handleTags} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">📦 Product name</label>
                    <input value={tagsForm.productName} onChange={e => setTagsForm({ ...tagsForm, productName: e.target.value })} required placeholder="e.g. Wireless Gaming Headphones" className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">📝 Description <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea value={tagsForm.description} onChange={e => setTagsForm({ ...tagsForm, description: e.target.value })} rows={2} placeholder="Brief product description..." className={`${inputClasses} resize-none`} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">🏷️ Current category <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input value={tagsForm.category} onChange={e => setTagsForm({ ...tagsForm, category: e.target.value })} placeholder="e.g. Electronics" className={inputClasses} />
                  </div>
                  <button type="submit" disabled={tagsLoading} className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm px-6 py-3.5 rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2 group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700 opacity-0 group-hover:opacity-100" />
                    {tagsLoading ? (
                      <span className="relative flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</span>
                    ) : (
                      <span className="relative">✨ Generate tags</span>
                    )}
                  </button>
                </form>

                {tagsResult && (
                  <div className="mt-6 space-y-4 animate-scale-in">
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl">
                      <span className="inline-block text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-semibold mb-3">🤖 AI Generated Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {tagsResult.tags.map(tag => (
                          <span key={tag} className="text-xs bg-white text-purple-700 border border-purple-200 px-3 py-1.5 rounded-full font-medium shadow-sm hover:bg-purple-50 transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button onClick={() => copyToClipboard(tagsResult.tags.join(', '))} className="text-xs text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2 mt-3 inline-block">Copy all tags</button>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
                      <p className="text-xs font-bold text-emerald-700 mb-1">Suggested category</p>
                      <p className="text-sm font-bold text-gray-800">{tagsResult.category}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-gray-200 p-6 shadow-xl shadow-amber-500/[0.05]">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                    <span className="text-white text-lg">💰</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">Smart Pricing Suggestion</h2>
                    <p className="text-gray-400 text-xs">AI-powered market analysis for optimal pricing</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 mb-5 ml-12">
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Market Insights</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Price Optimization</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Revenue Growth</span>
                </div>

                <form onSubmit={handlePricing} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">📦 Product name</label>
                    <input value={pricingForm.productName} onChange={e => setPricingForm({ ...pricingForm, productName: e.target.value })} required placeholder="e.g. Handmade Leather Wallet" className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">🏷️ Category</label>
                    <input value={pricingForm.category} onChange={e => setPricingForm({ ...pricingForm, category: e.target.value })} placeholder="e.g. Fashion" className={inputClasses} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">💲 Current price (₹)</label>
                    <input type="number" min="0" value={pricingForm.currentPrice} onChange={e => setPricingForm({ ...pricingForm, currentPrice: e.target.value })} required placeholder="0" className={inputClasses} />
                  </div>
                  <button type="submit" disabled={pricingLoading} className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-6 py-3.5 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2 group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700 opacity-0 group-hover:opacity-100" />
                    {pricingLoading ? (
                      <span className="relative flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analysing...</span>
                    ) : (
                      <span className="relative">✨ Get price suggestion</span>
                    )}
                  </button>
                </form>

                {pricingResult && (
                  <div className="mt-6 space-y-4 animate-scale-in">
                    <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl text-center">
                      <span className="inline-block text-[10px] bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-semibold mb-3">🤖 AI Suggested Price</span>
                      <p className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent drop-shadow-md">
                        ₹{pricingResult.suggestedPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-5 bg-gray-50 border-2 border-gray-200 rounded-xl">
                      <p className="text-xs font-bold text-gray-500 mb-2">Reasoning</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{pricingResult.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Insight Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-5 shadow-lg sticky top-6 animate-glow-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white text-lg">🧠</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">{aiInsights[activeTab].title}</p>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                {aiInsights[activeTab].points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-purple-500 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-700">✨ This tool uses Gemini to provide intelligent results based on your inputs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITools