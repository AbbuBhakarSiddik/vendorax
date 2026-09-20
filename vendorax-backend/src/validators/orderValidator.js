const { z } = require('zod')

const initiatePaymentSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  products: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      name: z.string().min(1, 'Product name is required'),
      price: z.number().positive('Price must be a positive number'),
      qty: z.number().int('Quantity must be an integer').positive('Quantity must be positive')
    })
  ).min(1, 'At least one product is required'),
  totalAmount: z.number().positive('Total amount must be positive'),
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    phone: z.string().min(1, 'Phone is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    pincode: z.string().min(1, 'Pincode is required')
  })
})

module.exports = {
  initiatePaymentSchema
}
