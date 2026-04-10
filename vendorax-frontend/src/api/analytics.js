import api from './axiosInstance'

export const getStoreAnalytics = () => api.get('/analytics/store')