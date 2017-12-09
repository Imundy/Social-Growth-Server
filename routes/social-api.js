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
  const accounts = await socialService.getAccountsForUser({ userId: req.user.id });
  res.status(200).json({ accounts });
});

router.get('/accounts/:accountId', async (req, res) => {
  const account = await socialService.getAccountForUser({ userId: req.user.id, accountId: req.params.accountId });
  res.status(200).json(account);
});

router.put('/accounts/:accountId/settings', async (req, res) => {
  try {
    const settingsId = await socialService.updateSettingsForAccount({ accountId: req.params.accountId, userId: req.user.id, settings: req.body.settings });
    res.status(200).json(settingsId);
  } catch (error) {
    return res.status(400).send();
  }
});

router.get('/accounts/:accountId/settings', async (req, res) => {
  const settings = await socialService.getSettingsForAccount({ accountId: req.params.accountId, userId: req.user.id });
  res.status(200).json(settings);
});

module.exports = router;
