const {
  generateDescription,
  generateTags,
  generatePricingSuggestion
} = require('../services/aiService')

exports.getDescription = async (req, res) => {
  try {
    const { productName, features } = req.body
    if (!productName || !features) {
      return res.status(400).json({ message: 'Product name and features are required' })
    }
    const description = await generateDescription(productName, features)
    res.json({ description })
  } catch (error) {
    console.error('AI description error:', error)
    res.status(500).json({ message: 'AI generation failed' })
  }
}

exports.getTags = async (req, res) => {
  try {
    const { productName, description, category } = req.body
    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' })
    }
    const result = await generateTags(productName, description, category)
    res.json(result)
  } catch (error) {
    console.error('AI tags error:', error)
    res.status(500).json({ message: 'AI generation failed' })
  }
}

exports.getPricingSuggestion = async (req, res) => {
  try {
    const { productName, category, currentPrice, orderHistory } = req.body
    if (!productName || !currentPrice) {
      return res.status(400).json({ message: 'Product name and price are required' })
    }
    const result = await generatePricingSuggestion(
      productName, category, currentPrice, orderHistory || 0
    )
    res.json(result)
  } catch (error) {
    console.error('AI pricing error:', error)
    res.status(500).json({ message: 'AI generation failed' })
  }
}