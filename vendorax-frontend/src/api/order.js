import api from './axiosInstance'

export const initiatePayment = (payload) =>
  api.post('/orders/payment/initiate', payload)

export const verifyPayment = (payload) =>
  api.post('/orders/payment/verify', payload)

export const getBuyerOrders = () =>
  api.get('/orders/buyer')

export const cancelOrder = (orderId) =>
  api.put(`/orders/${orderId}/cancel`)

export const getOrderById = (orderId) =>
  api.get(`/orders/${orderId}`)
