const { expect } = require('chai')
const MockExpressRequest = require('mock-express-request')
const sinon = require('sinon')

const { authorize } = require('../authorization')
const AuthorizationError = require('../errors')


describe('#authorize', () => {
  it('when authorization header is not present, it throws an error', () => {
    const request = new MockExpressRequest()

    expect(() => authorize(request)).to.throw(AuthorizationError)
  })

  it('does not throw error if the authorization header is set up', () => {
    const request = new MockExpressRequest({
      headers: {
        Authorization: '123qwe'
      }
    })
    const resSpy = sinon.spy()
    const nextSpy = sinon.spy()

    expect(() => authorize(request, resSpy, nextSpy)).to.not.throw()
    expect(nextSpy.called).to.be.true
  })
})
