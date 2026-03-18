const Product = require('../models/Product')
const Store = require('../models/Store')
const { cloudinary } = require('../config/cloudinary')

exports.createProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    if (!store) {
      return res.status(404).json({ message: 'Create a store first' })
    }

    const { name, description, price, category, tags, stock, images } = req.body

    const product = await Product.create({
      storeId: store._id,
      name,
      description,
      price,
      category,
      tags: tags || [],
      stock: stock || 0,
      images: images || []
    })

    res.status(201).json({ message: 'Product created', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMyProducts = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    if (!store) {
      return res.status(404).json({ message: 'No store found' })
    }

    const products = await Product.find({ storeId: store._id }).sort({ createdAt: -1 })
    res.json({ products })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    const product = await Product.findOne({ _id: req.params.id, storeId: store._id })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const { name, description, price, category, tags, stock, images } = req.body

    if (name) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = price
    if (category !== undefined) product.category = category
    if (tags !== undefined) product.tags = tags
    if (stock !== undefined) product.stock = stock
    if (images !== undefined) product.images = images

    await product.save()
    res.json({ message: 'Product updated', product })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: error.message, stack: error.stack })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    const product = await Product.findOne({ _id: req.params.id, storeId: store._id })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    await product.deleteOne()
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getProductsByStore = async (req, res) => {
  try {
    const store = await Store.findOne({ storeSlug: req.params.slug })
    if (!store) {
      return res.status(404).json({ message: 'Store not found' })
    }

    const products = await Product.find({ storeId: store._id }).sort({ createdAt: -1 })
    res.json({ products })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('storeId', 'storeName storeSlug')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }

    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteProductImage = async (req, res) => {
  try {
    const { public_id } = req.body
    if (!public_id) {
      return res.status(400).json({ message: 'public_id required' })
    }
    await cloudinary.uploader.destroy(public_id)
    res.json({ message: 'Image deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}