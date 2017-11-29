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

router.post('settings/reviews', (req, res) => {

});

router.get('settings/reviews', (req, res) => {
  
});

router.post('settings/comments/like', (req, res) => {
  
});

router.get('settings/comments/like', (req, res) => {
  
});

router.post('settings/comments/hide', (req, res) => {
  
});

router.get('settings/comments/hide', (req, res) => {
  
});

module.exports = router;
