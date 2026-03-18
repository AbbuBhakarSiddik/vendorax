import api from './axiosInstance'

export const createStore = (data) => api.post('/stores', data)
export const getMyStore = () => api.get('/stores/my')
export const updateStore = (data) => api.put('/stores/my', data)
export const getStoreBySlug = (slug) => api.get(`/stores/${slug}`)