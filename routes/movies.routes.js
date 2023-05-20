const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require('../models/Movie.model');

// All movies page -----------------------**********************-------------------------*************************-
router.get('/all-movies', (req, res) => {
  Movie.find()
  .then((allMovies) => {
    res.render('movies/movies', {movies: allMovies});
  })
  .catch((err) => {
    console.log(err);
  })
 
})

//// Adding New Movie -------*****-------*****-------*****-------*****-------*****-------*****
router.get('/create', (req, res) => {
  Celebrity.find()
  .then((allCelebrities) => {
    res.render('movies/new-movie', {celebrities: allCelebrities})
  })
  .catch((err) => {
    console.log(err);
  })

});

router.post('/create', (req, res) => {
  Movie.create({
    title: req.body.theTitle,
    genre: req.body.theGenre,
    plot: req.body.thePlot,
    cast: req.body.theCelebrity
  })
  .then((response) => {
    res.redirect('/movies/all-movies')
  })
  .catch((err) => {
    console.log(err);
  })
})


// The Movie Details Page----------********************---------------------*********------

router.get('/:id', (req, res) => {
  const ID = req.params.id;
  Movie.findById(ID).populate('cast')
  .then((movieDetails) => {
    res.render('movies/movie-details', {movieDetails: movieDetails})
  })
  .catch((err) => {
    console.log(err);
  })
})




















module.exports = router;