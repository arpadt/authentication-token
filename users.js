const bcrypt = require('bcryptjs')

const users = [
  {
    username: 'John',
    password: bcrypt.hashSync('password', 10)
  }, {
    username: 'Jill',
    password: bcrypt.hashSync('123qwe', 10)
  }
]

module.exports = {
  users
}
