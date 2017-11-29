var jwt = require('jsonwebtoken');
var config = require('../../config');
const userService = require('../services/user-service');

const jwtMiddleware = (req, res, next) => {
  try {
    const tokenHeader = req.get('Authorization').split(' ');
    const decoded = jwt.verify(tokenHeader[1], config.jwtSecretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send();
  }
}

module.exports = jwtMiddleware;