var express = require('express');
const jwtMiddleware = require('./auth/jwt-middleware');
const socialService = require('./services/social-service');
var router = express.Router();

router.use(jwtMiddleware);

router.post('/accounts/add', async (req, res) => {
  if (!req.body.tokens || !req.body.facebookId) {
    return res.status(400).json({ error: 'Must provide tokens and facebookId' }).send();
  }

  const accountId = await socialService.addAccount({
    userId: req.user.id,
    tokens: req.body.tokens,
    type: 'facebook',
    socialAccountId: req.body.facebookId,
  })
  res.status(200).json({ accountId }).send();
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
