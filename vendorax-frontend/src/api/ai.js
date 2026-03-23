import api from './axiosInstance'

export const generateDescription = (data) => api.post('/ai/description', data)
export const generateTags = (data) => api.post('/ai/tags', data)
export const getPricingSuggestion = (data) => api.post('/ai/pricing', data)