var express = require('express');
const jwtMiddleware = require('./auth/jwt-middleware');
const socialService = require('./services/social-service');
const router = express.Router();

router.use(jwtMiddleware);

router.post('/accounts/add', async (req, res) => {
  if (!req.body.tokens || !req.body.socialAccountId || !req.body.type) {
    return res.status(400).json({ error: 'Must provide token, type, and social account id' }).send();
  }

  const accountId = await socialService.addAccount({
    userId: req.user.id,
    tokens: req.body.tokens,
    type: req.body.type,
    socialAccountId: req.body.socialAccountId,
  })
  res.status(200).json({ accountId }).send();
});

router.post('/accounts/remove', async (req, res) => {
  if (!req.body.accountId) {
    return res.status(400).json({ error: 'Must provide accountId' }).send();
  }

  const accountId = await socialService.removeAccount({
    userId: req.user.id,
    accountId: req.body.accountId,
  })
  res.status(200).send();
});

router.get('/accounts', async (req, res) => {

});

router.post('/facebook/settings', async (req, res) => {

});

router.get('/facebook/settings', async (req, res) => {
  
});

router.post('/instagram/settings', async (req, res) => {

});

router.get('/instagram/settings', async (req, res) => {
  
});

router.post('/twitter/settings', async (req, res) => {

});

router.get('/twitter/settings', async (req, res) => {
  
});

module.exports = router;
