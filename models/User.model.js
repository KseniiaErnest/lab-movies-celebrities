const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is Required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      'Please use a valid email address.'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  movie: {
    type: [mongoose.Types.ObjectId],
    ref: 'Movie'
  },
  admin: {type: Boolean, default: false}
},
{
  timestamps: true
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;