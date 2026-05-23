import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStore } from '../../../api/store'

const CreateStore = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ storeName: '', description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createStore(form)
      setShowSuccess(true)
      setTimeout(() => navigate('/seller/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  const slug = form.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const progressPercentage = (form.storeName.length + form.description.length) / 100 * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-blue-50 overflow-hidden">
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-float-bounce { animation: float-bounce 3s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }

        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .input-focus {
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }

        .input-focus:focus {
          transform: translateY(-2px);
        }

        /* Progress bar animation */
        .progress-bar {
          background: linear-gradient(90deg, #8b5cf6, #a78bfa, #8b5cf6);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl animate-float-bounce"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-float-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Information & Benefits */}
            <div className="animate-fade-in-up">
              <div className="mb-8">
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
                  Launch Your Store
                </h1>
                <p className="text-xl text-gray-600 font-light leading-relaxed">
                  Start selling on VendoraX in minutes. Zero technical knowledge required.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: '⚡',
                    title: 'Lightning Fast Setup',
                    desc: 'Create your store in under 5 minutes',
                    color: 'from-amber-400 to-orange-400'
                  },
                  {
                    icon: '🎨',
                    title: 'Customizable Design',
                    desc: 'Make it yours with flexible styling options',
                    color: 'from-pink-400 to-rose-400'
                  },
                  {
                    icon: '🤖',
                    title: 'AI-Powered Tools',
                    desc: 'Intelligent product descriptions & analytics',
                    color: 'from-blue-400 to-cyan-400'
                  },
                  {
                    icon: '💰',
                    title: 'Keep More Earnings',
                    desc: 'Low fees, instant payouts every week',
                    color: 'from-emerald-400 to-green-400'
                  },
                ].map((benefit, idx) => (
                  <div key={idx}
                    className="glass-effect rounded-2xl p-5 border-2 border-white/60 hover:border-white/80 transition-all duration-300 hover:shadow-xl animate-slide-in-left group cursor-pointer"
                    style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{benefit.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: '2K+', label: 'Active Sellers' },
                  { num: '50K+', label: 'Happy Buyers' },
                  { num: '∞', label: 'Possibilities' }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-effect rounded-xl p-4 border border-white/60 text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{stat.num}</div>
                    <div className="text-xs text-gray-600 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-fade-in-down">
              {/* Form Card with Glassmorphism */}
              <div className="glass-effect rounded-3xl p-8 border-2 border-white/70 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
                
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-glow-pulse">
                    <span className="text-5xl">🏪</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Create Store</h2>
                  <p className="text-gray-600 text-sm">Set up your store on VendoraX in seconds</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 bg-white rounded-full h-1.5 overflow-hidden border border-purple-200">
                  <div
                    className="progress-bar h-full transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 animate-scale-in">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-red-700 font-semibold text-sm">{error}</p>
                      <p className="text-red-600 text-xs mt-1">Please check your input and try again</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {showSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-start gap-3 animate-scale-in">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-emerald-700 font-semibold text-sm">Store created successfully! 🎉</p>
                      <p className="text-emerald-600 text-xs mt-1">Redirecting to dashboard...</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Store Name Input */}
                  <div>
                    <label className={`text-sm font-bold mb-2.5 block transition-colors duration-200 ${
                      focusedField === 'storeName' ? 'text-purple-600' : 'text-gray-800'
                    }`}>
                      Store Name * 
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 align-middle transition-all duration-200 ${
                        focusedField === 'storeName' ? 'bg-purple-500 opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`} />
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 group-focus-within:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        name="storeName"
                        type="text"
                        required
                        value={form.storeName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('storeName')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. Fresh Bakes by Priya"
                        className="input-focus w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-4 text-base focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-white/60 hover:bg-white hover:border-purple-300 font-medium"
                      />
                      <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${form.storeName ? 'text-emerald-500 scale-100' : 'text-gray-300 scale-0'}`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {form.storeName && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50 animate-scale-in">
                        <p className="text-xs text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span><strong className="text-purple-700">Store URL:</strong> vendorax.app/store/<span className="font-bold text-purple-600">{slug}</span></span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Description Input */}
                  <div>
                    <label className={`text-sm font-bold mb-2.5 block transition-colors duration-200 ${
                      focusedField === 'description' ? 'text-purple-600' : 'text-gray-800'
                    }`}>
                      Store Description * 
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 align-middle transition-all duration-200 ${
                        focusedField === 'description' ? 'bg-purple-500 opacity-100 scale-100' : 'opacity-0 scale-0'
                      }`} />
                    </label>
                    <div className="relative group">
                      <textarea
                        name="description"
                        rows={5}
                        required
                        value={form.description}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('description')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Tell buyers what your store is about... What makes you unique? What products do you sell?"
                        className="input-focus w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-white/60 hover:bg-white hover:border-purple-300 resize-none font-medium"
                      />
                      <div className="absolute right-4 top-4 text-xs font-semibold text-gray-400">
                        {form.description.length}/500
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${(form.description.length / 500) * 100}%` }}>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !form.storeName || !form.description}
                    className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white py-4 rounded-xl text-base font-bold hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 group">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2.5 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating your store...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Your Store</span>
                      </>
                    )}
                  </button>

                  {/* Info Text */}
                  <p className="text-center text-xs text-gray-500 mt-6">
                    ✨ No credit card required • Set up in 2 minutes • Start selling immediately
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateStore