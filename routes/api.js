var express = require('express');
var router = express.Router();
const jwtMiddleware = require('./auth/jwt-middleware');

router.use(jwtMiddleware);

router.get('/documentation', (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;