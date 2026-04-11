import api from './axiosInstance'

export const getPlatformStats = () => api.get('/admin/stats')
export const getAllUsers = (params) => api.get('/admin/users', { params })
export const getAllStores = () => api.get('/admin/stores')
export const getAllOrders = () => api.get('/admin/orders')
export const toggleStoreStatus = (id) => api.put(`/admin/stores/${id}/toggle-status`)
export const toggleFeaturedStore = (id) => api.put(`/admin/stores/${id}/toggle-featured`)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)