const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema ({
  title: String,
  genre: String,
  plot: String,
  cast: [{type: mongoose.Types.ObjectId, ref: 'Celebrity'}],
  image: String
  // even though we upload an image, this property will still be a string
    // because we will upload an image to a 3rd party server and get a url for it
    // and the url is what we will save to our Pokemon model
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;