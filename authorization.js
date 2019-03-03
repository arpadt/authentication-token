const AuthorizationError = require('./errors')

const authorize = (req, res, next) => {
  if (!(req.headers && req.headers.authorization)) {
    throw new AuthorizationError('Not authorized', 401)
  }
  next()
}

module.exports = {
  authorize
}
