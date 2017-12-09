var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/privacy', (req, res, next) => {
  res.render('privacy-policy');
});

router.get('/terms-and-conditions', (req, res, next) => {
  res.render('terms-and-conditions');
});

module.exports = router;
