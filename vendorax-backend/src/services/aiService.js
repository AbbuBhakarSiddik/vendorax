const model = require('../config/ai')

exports.generateDescription = async (productName, features) => {
  const prompt = `Write a professional and compelling ecommerce product description for:
Product Name: ${productName}
Key Features: ${features}

Requirements:
- 2-3 sentences maximum
- Highlight benefits not just features
- Sound natural and persuasive
- No bullet points, just flowing text
- End with a subtle call to action

Return only the description, nothing else.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

exports.generateTags = async (productName, description, category) => {
  const prompt = `Generate relevant ecommerce tags and suggest the best category for this product:
Product Name: ${productName}
Description: ${description}
Current Category: ${category || 'not set'}

Return ONLY a valid JSON object in this exact format with no markdown, no backticks, no extra text:
{"tags": ["tag1", "tag2", "tag3", "tag4", "tag5"], "category": "suggested category"}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

exports.generatePricingSuggestion = async (productName, category, currentPrice, orderHistory) => {
  const prompt = `As an ecommerce pricing expert, suggest an optimal price for:
Product: ${productName}
Category: ${category}
Current Price: ₹${currentPrice}
Recent order count: ${orderHistory}

Consider market demand and competitiveness.
Return ONLY a valid JSON object with no markdown:
{"suggestedPrice": 999, "reason": "one sentence explanation"}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}