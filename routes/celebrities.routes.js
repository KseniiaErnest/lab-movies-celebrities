const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");


// Adding New Celebrity -------*****-------*****-------*****-------*****-------*****-------*****
router.get('/celebrities/create', (req, res) => {
  res.render('celebrities/new-celebrity')
});

router.post('/celebrities/create', (req, res) => {
  Celebrity.create({
  name: req.body.theName,
  occupation: req.body.theOccupation,
  catchPhrase: req.body.theCatchphrase
  })
  .then((response) => {
    res.redirect('/all-celebrities');
  })
  .catch((err) => {
    res.render('celebrities/new-celebrity');
  })
})


















module.exports = router;