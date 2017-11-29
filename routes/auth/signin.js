const jwt = require('jsonwebtoken');
const config = require('../../config');

const signin = (user) => {
  const token = jwt.sign(user, config.jwtSecretKey);
  return token;
}

module.exports = signin;
