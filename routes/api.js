var express = require('express');
const jwtMiddleware = require('./auth/jwt-middleware');
var router = express.Router();

router.use(jwtMiddleware);

router.get('/documentation', (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;