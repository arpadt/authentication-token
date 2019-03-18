class AuthorizationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthorizationError'
    this.httpStatusCode = 401
  }
}

module.exports = AuthorizationError
