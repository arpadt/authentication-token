class AuthorizationError extends Error {
  constructor(message, httpStatusCode) {
    super(message)
    this.name = 'AuthorizationError'
    this.httpStatusCode = httpStatusCode
  }
}

module.exports = AuthorizationError
