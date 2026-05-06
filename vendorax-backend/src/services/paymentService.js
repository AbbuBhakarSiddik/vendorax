const Razorpay = require('razorpay')
const crypto = require('crypto')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in rupees
 * @param {string} receipt - Unique receipt ID (our internal order reference, max 40 chars)
 */
exports.createRazorpayOrder = async (amount, receipt) => {
    const options = {
        amount: Math.round(amount * 100), // Razorpay expects paise
        currency: 'INR',
        receipt: receipt.substring(0, 40), // Razorpay enforces 40-char max
        payment_capture: 1
    }
    try {
        console.log('Creating Razorpay order:', { amount: options.amount, receipt: options.receipt })
        const order = await razorpay.orders.create(options)
        console.log('Razorpay order created:', order.id)
        return order
    } catch (err) {
        console.error('Razorpay order creation failed:', err?.error || err?.message || err)
        throw new Error(err?.error?.description || err?.message || 'Razorpay order creation failed')
    }
}

/**
 * Verify Razorpay payment signature
 */
exports.verifyPaymentSignature = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex')
    return expectedSignature === razorpay_signature
}
