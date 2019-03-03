const { expect } = require('chai')
const request = require('supertest')

const app = require('../server')

describe('#API', () => {
  before(async () => {
    await app.listen(3006, () => {
      console.log('Test server is running')
    })
  })

  after(async () => {
    await app.close()
  })

  describe('GET /', () => {
    it('allows the base url to be hit', async () => {
      const { body, status } = await request(app)
        .get('/')

      expect(body).to.have.property('message', 'The endpoint has been hit')
      expect(status).to.eql(200)
    })
  })

  describe('GET private', () => {
    it('returns 401 if the user is not logged in', async () => {
      const { body, status } = await request(app)
        .get('/private')

      expect(body).to.have.property('message', 'Not authorized')
      expect(status).to.eql(401)
    })

    it('returns a success message if the user is logged in', async () => {
      const { body, status } = await request(app)
        .get('/private')
        .set('Authorization', 'Basic 123qwe')

      expect(status).to.be.eql(200)
      expect(body).to.have.property('message', 'The private endpoint is only allowed for authenticated users')
    })
  })

  describe('GET /login', () => {
    it('no username is given, will return an error', async () => {
      const response = await request(app)
        .post('/login')
        .send({})

      expect(response.status).to.be.eql(400)
      expect(response.body).to.have.property('message', 'Enter username or password')
    })

    it('should return an error when the user does not exist', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Jack', password: '123qwe' })

      expect(response.status).to.be.eql(400)
      expect(response.body).to.have.property('message', 'Incorrect username/password')
    })

    it('returns an error if the password for the user is incorrect', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'John', password: '123qwe' })

      expect(response.status).to.be.eql(400)
      expect(response.body).to.have.property('message', 'Incorrect username/password')
    })

    it('sets the Authorization header and redirects to /private if the credentials are correct', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'John', password: 'password' })

      expect(response.status).to.be.eql(302)
      expect(response.redirect).to.be.true
      expect(response.headers).to.have.property('location', '/private')
    })
  })
})
