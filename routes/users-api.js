const express = require('express');
const bcrypt = require('bcrypt');
const signin = require('./auth/signin');
const userService = require('./services/user-service');

const router = express.Router();

/* GET users listing. */
router.post('/signin', async function(req, res, next) {
  const user = await userService.getUser({ email: req.body.email });
  if (bcrypt.compareSync(req.body.password, user.password)) {
    const token = signin({ email: req.body.email, userId: 12345 });
    return res.status(200).json({ token }).send();
  } else {
    return res.status(401).json({ error: 'Incorrect email or password' }).send();
  }
});


router.post('/register', async function(req, res, next) {
  if (req.body.email == null) {
    return res.status(400).json({ error: 'Email cannot be empty' }).send();
  } else if (req.body.password == null) {
    return res.status(400).json({ error: 'Password cannot be empty' }).send();
  }

  const userId = await userService.createUser({ email: req.body.email, password: req.body.password });
  res.status(200).json({ userId }).send();
});

module.exports = router;
