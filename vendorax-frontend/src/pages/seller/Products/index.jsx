import { useEffect, useState } from 'react'
import {
  getMyProducts, createProduct, updateProduct,
  deleteProduct, uploadProductImage, deleteProductImage
} from '../../../api/product'

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', tags: '' }

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

  const fetchProducts = async () => {
    try {
      const res = await getMyProducts()
      setProducts(res.data.products)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await uploadProductImage(formData)
      setImages(prev => [...prev, { url: res.data.url, public_id: res.data.public_id }])
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleRemoveImage = async (public_id) => {
    if (public_id.startsWith('existing_')) {
      setImages(prev => prev.filter(img => img.public_id !== public_id))
      return
    }
    try {
      await deleteProductImage(public_id)
      setImages(prev => prev.filter(img => img.public_id !== public_id))
    } catch {
      setError('Failed to remove image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: images.map(img => img.url)
      }
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      setForm(emptyForm)
      setImages([])
      setShowForm(false)
      setEditingId(null)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      stock: product.stock,
      tags: product.tags.join(', ')
    })
    setImages(
      (product.images || []).map((url, i) => ({ url, public_id: `existing_${i}` }))
    )
    setEditingId(product._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setImages([])
    setError('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} in your store
            </p>
          </div>
          <button
            onClick={() => { if (showForm) { handleCancel() } else { setShowForm(true) } }}
            className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit product' : 'New product'}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium text-gray-700">Product name</label>
                <input name="name" required value={form.name} onChange={handleChange}
                  placeholder="e.g. Handmade Chocolate Cake"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input name="category" value={form.category} onChange={handleChange}
                  placeholder="e.g. Bakery, Electronics"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <input name="price" type="number" required min="0" value={form.price} onChange={handleChange}
                  placeholder="0"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Stock quantity</label>
                <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                  placeholder="0"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleChange}
                  placeholder="Describe your product..."
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Tags
                  <span className="text-gray-400 font-normal ml-1">(comma separated)</span>
                </label>
                <input name="tags" value={form.tags} onChange={handleChange}
                  placeholder="e.g. fresh, homemade, vegan"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              {/* Image upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Product images
                  <span className="text-gray-400 font-normal ml-1">(max 5MB each, auto-optimized)</span>
                </label>
                <div className="mt-2 flex flex-wrap gap-3">

                  {images.map((img) => (
                    <div key={img.public_id} className="relative w-24 h-24 group">
                      <img
                        src={img.url}
                        alt="product"
                        className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.public_id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 shadow"
                      >
                        x
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition
                      ${uploadingImage
                        ? 'border-gray-200 opacity-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                      }`}>
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-gray-400">Uploading</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl text-gray-400 leading-none">+</span>
                          <span className="text-xs text-gray-400 mt-1">Add image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  )}

                </div>
                {images.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    {images.length}/5 images · Served via CDN · Auto-compressed to WebP
                  </p>
                )}
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-purple-600 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-purple-700 transition disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update product' : 'Add product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm px-6 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Product list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="w-full h-40 bg-gray-100 rounded-lg mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-gray-400 text-4xl mb-3">📦</p>
            <p className="text-gray-600 font-medium text-sm">No products yet</p>
            <p className="text-gray-400 text-xs mt-1">Click "+ Add product" to add your first one</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">

                {/* Product image */}
                {p.images && p.images.length > 0 ? (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{p.name}</h3>
                    <span className="text-purple-700 font-bold text-sm ml-2 shrink-0">₹{p.price}</span>
                  </div>

                  {p.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                  )}

                  {p.description && (
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{p.description}</p>
                  )}

                  {p.tags && p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 5
                      ? 'bg-teal-50 text-teal-700'
                      : p.stock > 0
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-600'
                      }`}>
                      {p.stock > 5
                        ? `${p.stock} in stock`
                        : p.stock > 0
                          ? `Only ${p.stock} left`
                          : 'Out of stock'
                      }
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-xs text-purple-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-xs text-red-500 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default SellerProducts