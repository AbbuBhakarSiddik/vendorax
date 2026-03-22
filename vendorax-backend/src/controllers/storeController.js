const Store = require('../models/Store')

const generateSlug = (name) => {
  return name.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

exports.createStore = async (req, res) => {
  try {
    const { storeName, description } = req.body

    const existing = await Store.findOne({ sellerId: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You already have a store' })
    }

    let slug = generateSlug(storeName)
    const slugExists = await Store.findOne({ storeSlug: slug })
    if (slugExists) slug = `${slug}-${Date.now()}`

    const store = await Store.create({
      sellerId: req.user._id,
      storeName,
      storeSlug: slug,
      description
    })

    res.status(201).json({ message: 'Store created successfully', store })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.user._id })
    if (!store) {
      return res.status(404).json({ message: 'No store found' })
    }
    res.json({ store })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateStore = async (req, res) => {
  try {
    const { storeName, description } = req.body

    const store = await Store.findOne({ sellerId: req.user._id })
    if (!store) {
      return res.status(404).json({ message: 'Store not found' })
    }

    if (storeName) {
      store.storeName = storeName
      store.storeSlug = generateSlug(storeName)
    }
    if (description !== undefined) store.description = description

    await store.save()
    res.json({ message: 'Store updated', store })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({ storeSlug: req.params.slug })
      .populate('sellerId', 'name email')
    if (!store) {
      return res.status(404).json({ message: 'Store not found' })
    }
    res.json({ store })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getFeaturedStores = async (req, res) => {
  try {
    const stores = await Store.find({ isFeatured: true, isActive: true })
      .populate('sellerId', 'name')
      .limit(6)
    res.json({ stores })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getAllStores = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query
    const query = { isActive: true }
    if (search) {
      query.storeName = { $regex: search, $options: 'i' }
    }
    const stores = await Store.find(query)
      .populate('sellerId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
    const total = await Store.countDocuments(query)
    res.json({ stores, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}