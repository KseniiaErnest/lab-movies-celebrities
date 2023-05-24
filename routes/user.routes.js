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
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username: username})
  .then((gotUser) => {
    if (!gotUser) {
      console.log('no user found');
      res.render('/');
      return;
    } else if (bcryptjs.compareSync(password, gotUser.passwordHash)) {
      /*Save the user in the session */
      req.session.currentUser = gotUser;
      res.redirect('/user/userProfile');
    } else {
      console.log('sorry password does not match');
      res.redirect('/');
    }
  })
  .catch(err => console.log(err));
})

router.get('/userProfile', (req, res) => {
  res.render('user/user-profile', {userInSession: req.session.currentUser});
})

// POST route - logout
router.post('/logout', (req, res, next) => {
req.session.destroy();
res.redirect('/');
})


module.exports = router;