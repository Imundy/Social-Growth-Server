var express = require('express');
const jwtMiddleware = require('./auth/jwt-middleware');
const socialService = require('./services/social-service');
var router = express.Router();

router.use(jwtMiddleware);

router.post('/accounts/add', (req, res) => {
  if (!req.body.tokens || !req.body.twitterId) {
    return res.status(400).json({ error: 'Must provide tokens and twitterId' }).send();
  }

  const accountId = await socialService.addAccount({
    userId: req.user.id,
    tokens: req.body.tokens,
    type: 'instagram',
    socialAccountId: req.body.twitterId,
  })
  res.status(200).json({ accountId }).send();
});

router.post('/accounts/remove', (req, res) => {
  
});

router.get('/accounts', (req, res) => {

});

module.exports = router;
