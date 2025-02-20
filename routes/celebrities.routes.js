const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const isLoggedIn = require('../middleware/isLoggedIn');


// Adding New Celebrity -------*****-------*****-------*****-------*****-------*****-------*****
router.get('/create', isLoggedIn, (req, res) => {
  res.render('celebrities/new-celebrity')
});

router.post('/create', (req, res) => {
  Celebrity.create({
  name: req.body.theName,
  occupation: req.body.theOccupation,
  catchPhrase: req.body.theCatchphrase
  })
  .then((response) => {
    req.flash('success', 'Celebrity Successfully Created');
    res.redirect('/celebrities/all-celebrities');
  })
  .catch((err) => {
    console.log(err);
  })
})

// Listing Our Celebrities -------*****-------*****-------*****-------*****-------*****-------*****
router.get('/all-celebrities', (req, res) => {
  Celebrity.find()
  .then((allCelebrities) => {
    res.render('celebrities/celebrities', {celebrities: allCelebrities})
  })
  .catch((err) => {
    console.log(err);
  })
})











// http://localhost:3000/all-celebrities

http://localhost:3000/celebrities/celebrities/all-celebrities



module.exports = router;