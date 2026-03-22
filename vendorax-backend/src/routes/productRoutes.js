const express = require('express')
const router = express.Router()

const {
  createProduct, getMyProducts, updateProduct, deleteProduct,
  getProductsByStore, getSingleProduct,
  uploadProductImage, deleteProductImage,
  getTrendingProducts, searchProducts
} = require('../controllers/productController')


const { protect } = require('../middleware/authMiddleware')
const { checkRole } = require('../middleware/roleMiddleware')
const { upload } = require('../config/cloudinary')


router.get('/trending', getTrendingProducts)
router.get('/search', searchProducts)

router.post('/', protect, checkRole('seller'), createProduct)
router.get('/my', protect, checkRole('seller'), getMyProducts)
router.put('/:id', protect, checkRole('seller'), updateProduct)
router.delete('/:id', protect, checkRole('seller'), deleteProduct)
router.get('/store/:slug', getProductsByStore)
router.get('/:id', getSingleProduct)
router.post('/upload-image', protect, checkRole('seller'), upload.single('image'), uploadProductImage)
router.delete('/delete-image', protect, checkRole('seller'), deleteProductImage)
module.exports = router