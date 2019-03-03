const express = require('express')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const http = require('http')

const { authorize } = require('./authorization')
const { users } = require('./users')

const app = express()
const PORT = 3005

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  res.send({ message: 'The endpoint has been hit' })
})

app.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  if (!(username && password)) {
    return next(new Error('Enter username or password'))
  }

  if (!users.find(({ username: user }) => username === user)) {
    return next(new Error('Incorrect username/password'))
  }

  const hashForUser = users.find(({ username: user }) => user === username).password
  const isMatchingPassword = await bcrypt.compare(password, hashForUser)

  if (!isMatchingPassword) {
    return next(new Error("Incorrect username/password"))
  }

  req.headers.authorization = `Basic ${ username }:${ hashForUser }`
  res.redirect('/private')
})

app.get('/private', authorize, (req, res, next) => {
  res.send({ message: 'The private endpoint is only allowed for authenticated users' })
})

// error handling
app.use((err, req, res, next) => {
  res.status(err.httpStatusCode || 400).json({ message: err.message })
})

const server = http.createServer(app)

const boot = (port) => {
  server.listen(port, () => {
    console.log(`Server is listening on ${ port }`)
  })
}

if (require.main === module) {
  boot(PORT)
} else {
  module.exports = server
}

