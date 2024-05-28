const authorization = role => {
    return (req, res, next) => {
      if (!req.user)
        return res.status(401).json({ status: 'error', error: 'Unauthorized' })
      next()
    }
  }

  module.exports = authorization