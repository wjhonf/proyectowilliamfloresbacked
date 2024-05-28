const jwt = require('jsonwebtoken')

const secret = 'mySecret'

const generateToken = user => {
  return jwt.sign(user, secret, { expiresIn: '24h' })
}
const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader)
    return res.status(HTTP_RESPONSES.UNAUTHORIZED).json({ status: 'error', error: 'Unauthorized' })

  const token = authHeader.split(' ')[1]

  jwt.verify(token, secret, (error, credentials) => {
    if (error)
      return res.status(HTTP_RESPONSES.UNAUTHORIZED).json({ status: 'error', error: 'Unauthorized' })

    req.user = credentials.user

    next()
  })
}

module.exports = {
  generateToken,
  authToken,
}