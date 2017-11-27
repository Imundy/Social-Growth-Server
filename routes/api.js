var express = require('express');
var router = express.Router();

router.get('/documentation', (req, res) => {
  return res.status(200).json({ hello: 'world' });
});

module.exports = router;