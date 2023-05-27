const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const isLoggedIn = require('../middleware/isLoggedIn');
const saltRounds = 10;


// GET route - sign up
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// POST route - sign up
router.post('/signup', (req, res, next) => {

const username = req.body.username;
const email = req.body.email;
const password = req.body.password;

// Password vaidation
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
if (!regex.test(password)) {
  req.flash('error', 'Password must contain lowercase, capital, numerals, and special characters');
  res.redirect('/signup');
  return;
}

// make sure users fill all mandatory fields:
// if (!username || !email || !password) {
//   res.render('user/signup', {errorMessage: "All fields are mandatory. Please provide your username, email and password."
// });
// return;
// }

bcryptjs.genSalt(saltRounds)
.then(salt => bcryptjs.hash(password, salt))
.then(hashedPassword => {
  User.create({username: username, password: hashedPassword, email: email})
  .then(() => {
    req.flash("success", "Sign-up was successful");
    res.redirect('/');
  })
  .catch((error) => {
    if (error instanceof mongoose.Error) {
      // the way to create a message with req.flash to show user feedback after a redirect is like this
      req.flash("error", error.message)
      // first argument is the name of the key inside the req.flash object
     // second argument is the value
      res.redirect('/signup');
    }
  })
})
.catch((error) => {next(error)});
});

// GET route - login
router.get('/login', (req, res, next) => {
  res.render('user/login')
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);

  User.findOne({username: username})
  .then((gotUser) => {
    if (!gotUser) {
      req.flash('error', 'Username Not Found');
      res.redirect('/login');
      return;
    } else if (bcryptjs.compareSync(password, gotUser.password)) {
      /*Save the user in the session */
      req.session.currentUser = gotUser;
      req.flash('success', 'Successfully Logged In');
      res.redirect('/userProfile');
    } else {
      req.flash('error', "Password do not match");
      res.redirect('/login');
    }
  })
  .catch(err => next(err));
})

router.get('/userProfile', isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id).populate('movie')
  .then((theUser) => {
    res.render('user/user-profile', {theUser: theUser})
  })
});

// Admin option GET route
router.get('/all-users', (req, res, next) => {
  if (!(req.session.currentUser && req.session.currentUser.admin)) {
    res.redirect('/');
    return;
  }
  User.find()
  .then((allUsers) => {
    res.render('user/all-users', {users: allUsers});
  })
  .catch((err) => next(err));
});

// Admin can delete other users POST route
router.post('/delete-user', (req, res, next) => {
  if (!(req.session.currentUser && req.session.currentUser.admin)) {
    res.redirect('/');
    return
  };

   // when we deleted pokemon we put the ID in the params but this time were putting in the req.body using a hidden input (coming from name of hbs)
User.findByIdAndRemove(req.body.theUserID)
.then(() => {
  req.flash('success', 'The User Deleted')
  res.redirect('/all-users');
})
.catch((err) => next(err));
})

// POST route - logout
router.post('/logout', (req, res, next) => {
req.session.destroy();
res.redirect('/');
})


module.exports = router;