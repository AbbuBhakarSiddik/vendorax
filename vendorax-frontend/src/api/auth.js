import api from './axiosInstance'

export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const refreshToken = (data) => api.post('/auth/refresh', data)