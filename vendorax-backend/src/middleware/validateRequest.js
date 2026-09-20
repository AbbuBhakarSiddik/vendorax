const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    const errors = result.error.errors || result.error.issues
    return res.status(400).json({ message: errors[0].message })
  }
  next()
}

module.exports = validateRequest
