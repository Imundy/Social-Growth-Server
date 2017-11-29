var express = require('express');
const jwtMiddleware = require('./auth/jwt-middleware');
var router = express.Router();

router.use(jwtMiddleware);

router.post('/accounts/add', (req, res) => {

});

router.post('/accounts/remove', (req, res) => {
  
});

router.get('/accounts', (req, res) => {

});

module.exports = router;
