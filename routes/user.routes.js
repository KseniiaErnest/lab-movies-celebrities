const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');


// GET route - sign up
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// POST route - sign up
router.post('/signup', (req, res) => {
const saltRounds = 10;

const username = req.body.username;
const password = req.body.password;

bcryptjs.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {
  User.create({username: username, passwordHash: hashedPassword})
  .then(() => {
    res.redirect('/');
  })
})
.catch(err => console.log(err));
});

// GET route - login
router.get('/login', (req, res) => {
  res.render('user/login')
})


module.exports = router;