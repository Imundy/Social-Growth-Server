var express = require('express');
var router = express.Router();

router.get('/webhook', (req, res) => {
  const verify = req.query['hub.verify_token'];

  if (verify === 'quothTheRavenNevermore') {
    return res.json(parseInt(req.query['hub.challenge'], 10));
  }

  return res.status(200).send();
});

router.post('/webhook', (req, res) => {
  return res.status(200).send();
});

module.exports = router;