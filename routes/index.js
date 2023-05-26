const router = require("express").Router();

// connect routes/celebrities.routes.js and routes/movies.routes.js to server:
const celebritiesRoutes = require('./celebrities.routes');
router.use('/celebrities', celebritiesRoutes);

const moviesRoutes = require('./movies.routes');
router.use('/movies', moviesRoutes);

const userRoutes = require('./user.routes');
router.use('/', userRoutes);

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
