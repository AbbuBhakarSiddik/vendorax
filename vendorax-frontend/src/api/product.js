import api from './axiosInstance'

export const createProduct = (data) => api.post('/products', data)
export const getMyProducts = () => api.get('/products/my')
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
export const getProductsByStore = (slug) => api.get(`/products/store/${slug}`)
export const getSingleProduct = (id) => api.get(`/products/${id}`)
export const uploadProductImage = (formData) =>
  api.post('/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

export const deleteProductImage = (public_id) =>
  api.delete('/products/delete-image', { data: { public_id } })