import { useEffect, useState } from 'react'
import {
  getMyProducts, createProduct, updateProduct,
  deleteProduct, uploadProductImage, deleteProductImage
} from '../../../api/product'
import { generateDescription, generateTags } from '../../../api/ai'

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', tags: '' }
const ic = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 bg-gray-50/80 hover:bg-white hover:border-gray-300"

// Color palette for product card accents
const accentColors = [
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-blue-500 to-cyan-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-600'
]

// Simple hash to assign a consistent color per product
const getProductAccent = (id) => {
  let hash = 0
  for (let i = 0; i < (id || '').length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return accentColors[Math.abs(hash) % accentColors.length]
}

// Maps accent to a visible border color (e.g., border-violet-400)
const getBorderColor = (accent) => {
  const fromColor = accent.split(' ')[0].split('-').slice(1).join('-')
  const colorName = fromColor.split('-')[0]
  const borderMap = {
    violet: 'border-violet-400',
    emerald: 'border-emerald-400',
    amber: 'border-amber-400',
    blue: 'border-blue-400',
    rose: 'border-rose-400',
    indigo: 'border-indigo-400'
  }
  return borderMap[colorName] || 'border-gray-400'
}

const SellerProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [images, setImages] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [aiDescLoading, setAiDescLoading] = useState(false)
  const [aiTagsLoading, setAiTagsLoading] = useState(false)

  const fetchProducts = async () => {
    try { const res = await getMyProducts(); setProducts(res.data.products) }
    catch { setProducts([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploadingImage(true); setError('')
    try { const fd = new FormData(); fd.append('image', file); const res = await uploadProductImage(fd); setImages(prev => [...prev, { url: res.data.url, public_id: res.data.public_id }]) }
    catch { setError('Image upload failed. Please try again.') }
    finally { setUploadingImage(false); e.target.value = '' }
  }

  const handleRemoveImage = async (public_id) => {
    if (public_id.startsWith('existing_')) { setImages(prev => prev.filter(img => img.public_id !== public_id)); return }
    try { await deleteProductImage(public_id); setImages(prev => prev.filter(img => img.public_id !== public_id)) }
    catch { setError('Failed to remove image') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true); setError('')
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean), images: images.map(img => img.url) }
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      setForm(emptyForm); setImages([]); setShowForm(false); setEditingId(null); fetchProducts()
    } catch (err) { setError(err.response?.data?.message || 'Failed to save product') }
    finally { setSubmitting(false) }
  }

  const handleEdit = (product) => {
    setForm({ name: product.name, description: product.description || '', price: product.price, category: product.category || '', stock: product.stock, tags: product.tags.join(', ') })
    setImages((product.images || []).map((url, i) => ({ url, public_id: `existing_${i}` })))
    setEditingId(product._id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); setImages([]); setError('') }
  const handleDelete = async (id) => { if (!window.confirm('Delete this product?')) return; try { await deleteProduct(id); fetchProducts() } catch { setError('Failed to delete product') } }

  const handleAiDescription = async () => {
    if (!form.name) { setError('Enter a product name first'); return }
    setAiDescLoading(true); setError('')
    try { const res = await generateDescription({ productName: form.name, features: form.category || form.name }); setForm(prev => ({ ...prev, description: res.data.description })) }
    catch { setError('AI generation failed. Try again.') }
    finally { setAiDescLoading(false) }
  }

  const handleAiTags = async () => {
    if (!form.name) { setError('Enter a product name first'); return }
    setAiTagsLoading(true); setError('')
    try { const res = await generateTags({ productName: form.name, description: form.description, category: form.category }); setForm(prev => ({ ...prev, tags: res.data.tags.join(', '), category: res.data.category || prev.category })) }
    catch { setError('AI generation failed. Try again.') }
    finally { setAiTagsLoading(false) }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-gray-100">
      {/* Enhanced ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-amber-100/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="text-gray-400 text-sm">{products.length} product{products.length !== 1 ? 's' : ''} in your store</p>
            </div>
          </div>
          <button
            onClick={() => { if (showForm) handleCancel(); else setShowForm(true) }}
            className={`text-sm px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              showForm
                ? 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:-translate-y-0.5'
            }`}
          >
            {showForm ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Add product</>
            )}
          </button>
        </div>

        {/* Form (unchanged logic, improved styling) */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-8 shadow-xl shadow-purple-500/[0.05] animate-scale-in">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={editingId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                </svg>
              </div>
              <h2 className="font-bold text-gray-800">{editingId ? 'Edit product' : 'New product'}</h2>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-scale-in">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Product name</label>
                <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Handmade Chocolate Cake" className={ic} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
                <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Bakery, Electronics" className={ic} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Price (₹)</label>
                <input name="price" type="number" required min="0" value={form.price} onChange={handleChange} placeholder="0" className={ic} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Stock quantity</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="0" className={ic} />
              </div>

              {/* Description with AI */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Description</label>
                  <button type="button" onClick={handleAiDescription} disabled={aiDescLoading}
                    className="text-xs text-purple-600 border border-purple-200 px-2.5 py-1 rounded-lg hover:bg-purple-50 transition disabled:opacity-50 flex items-center gap-1 font-semibold">
                    {aiDescLoading ? (<><div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Generating...</>) : '✨ AI generate'}
                  </button>
                </div>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                  placeholder="Describe your product or use AI to generate..." className={`${ic} resize-none`} />
              </div>

              {/* Tags with AI */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <button type="button" onClick={handleAiTags} disabled={aiTagsLoading}
                    className="text-xs text-purple-600 border border-purple-200 px-2.5 py-1 rounded-lg hover:bg-purple-50 transition disabled:opacity-50 flex items-center gap-1 font-semibold">
                    {aiTagsLoading ? (<><div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Generating...</>) : '✨ AI suggest'}
                  </button>
                </div>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. fresh, homemade, vegan — or use AI suggest" className={ic} />
              </div>

              {/* Image upload */}
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-600 mb-2 block">Product images <span className="text-gray-400 font-normal">(max 5MB each)</span></label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img) => (
                    <div key={img.public_id} className="relative w-24 h-24 group">
                      <img src={img.url} alt="product" className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-purple-300 transition-colors" />
                      <button type="button" onClick={() => handleRemoveImage(img.public_id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 shadow-md transition-colors">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${uploadingImage ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'}`}>
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-1"><div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" /><span className="text-[10px] text-gray-400">Uploading</span></div>
                      ) : (
                        <><svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg><span className="text-[10px] text-gray-400 mt-1">Add image</span></>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  )}
                </div>
                {images.length > 0 && <p className="text-[10px] text-gray-400 mt-2">{images.length}/5 images · Served via CDN · Auto-compressed to WebP</p>}
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={submitting || uploadingImage}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 font-semibold flex items-center gap-2">
                  {submitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{editingId ? 'Update product' : 'Add product'}</>
                  )}
                </button>
                <button type="button" onClick={handleCancel} className="text-sm px-6 py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl border-2 border-gray-200 p-5 animate-pulse bg-white">
                <div className="w-full h-44 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-16 text-center animate-scale-in shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-gray-600 font-bold text-lg mb-1">No products yet</p>
            <p className="text-gray-400 text-sm">Click "Add product" to add your first one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => {
              const accent = getProductAccent(p._id)
              const borderColor = getBorderColor(accent)
              return (
                <div key={p._id}
                  className={`group relative bg-white rounded-2xl border-2 ${borderColor} overflow-hidden shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 stagger-child`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Colored accent line */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} />
                  
                  <div className="relative overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-md`}>
                          <span className="text-white text-2xl">📦</span>
                        </div>
                      </div>
                    )}
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1 group-hover:text-purple-700 transition-colors">
                        {p.name}
                      </h3>
                      <span className={`text-sm font-bold ml-2 shrink-0 bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
                        ₹{p.price?.toLocaleString()}
                      </span>
                    </div>

                    {p.category && (
                      <span className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 mb-2">
                        {p.category}
                      </span>
                    )}

                    {p.description && (
                      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                        p.stock > 5 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {p.stock > 5 ? `${p.stock} in stock` : p.stock > 0 ? `Only ${p.stock} left` : 'Out of stock'}
                      </span>

                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(p)}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium border border-purple-300 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all duration-200">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerProducts