const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require('../models/Movie.model');
const isLoggedIn = require('../middleware/isLoggedIn');
const User = require('../models/User.model');
// To upload images
const uploader = require("../config/cloudinary");

// All movies page -----------------------**********************-------------------------*************************-
router.get('/all-movies', (req, res, next) => {
  Movie.find()
  .then((allMovies) => {
    res.render('movies/movies', {movies: allMovies});
  })
  .catch((err) => {
    console.log(err);
  })
 
})

//// Adding New Movie -------*****-------*****-------*****-------*****-------*****-------*****
router.get('/create', isLoggedIn, (req, res, next) => {
  Celebrity.find()
  .then((allCelebrities) => {
    res.render('movies/new-movie', {celebrities: allCelebrities})
  })
  .catch((err) => {
    console.log(err);
  })

});

router.post('/create', isLoggedIn, uploader.single('img'), (req, res, next) => {
  Movie.create({
    title: req.body.theTitle,
    image: req.file.path,
    genre: req.body.theGenre,
    plot: req.body.thePlot,
    cast: req.body.theCelebrity
  })
  .then((response) => {
    req.flash('success', 'Movie Successfully Created');
    res.redirect('/movies/all-movies');
  })
  .catch((err) => {
  next(err);
  })
})


// The Movie Details Page----------********************---------------------*********------

router.get('/:id', (req, res, next) => {
  const ID = req.params.id;
  Movie.findById(ID).populate('cast')
  .then((movieDetails) => {
    res.render('movies/movie-details', {movieDetails: movieDetails})
  })
  .catch((err) => {
    console.log(err);
  })
})

// Deleting Movies -------******------******-------***********-------------********-----

router.post('/:theID/delete', (req, res, next) => {
  Movie.findByIdAndRemove(req.params.theID)
  .then(() => {
    req.flash('success', 'Movie Successfully Deleted');
    res.redirect('/movies/all-movies');
  })
  .catch((err) => {
    console.log(err);
  })
})

// Editing Movies -----------**************---------------**********---------*******
router.get('/:id/edit', (req, res, next) => {
  Movie.findById(req.params.id)
  .then((theMovie) => {
    Celebrity.find().then((allCelebrities) => {

      allCelebrities.forEach((theCelebrity) => {
        if ((theCelebrity._id).equals(theMovie.cast)) {
          theCelebrity.flag = true;
        }
      })
      res.render('movies/edit-movie', {theMovie: theMovie, celebrities: allCelebrities})
    })
  })
  .catch((err) => {
    console.log(err);
  })
 
});

router.post('/:theID/update', uploader.single('img'), (req, res, next) => {
  let theUpdate = {
  title: req.body.theTitle,
  genre: req.body.theGenre,
  plot: req.body.thePlot,
  cast: req.body.theCelebrity
  }
  if (req.file) {
    theUpdate.image = req.file.path;
  }
  console.log(req.file);
  
  Movie.findByIdAndUpdate(req.params.theID, theUpdate)
  .then(() => {
    req.flash('success', 'Movie Successfully Updated');
    res.redirect('/movies/'+req.params.theID);
  })
});

// Adding movie to user POST route

router.post('/add/:id', isLoggedIn,  (req, res, next) => {
  const movieID = req.params.id;

  Movie.findById(movieID)
  .then((theMovie) => {
    const userID = req.session.currentUser._id;
    User.findByIdAndUpdate(userID, {
      $push: {movie: theMovie}
})
.then(() => {
  req.flash('success', 'Movie Successfully Added')
  res.redirect('/movies/all-movies')
})
.catch((err) => next(err));
  }).catch((err) => next(err));

})













module.exports = router;