// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
require('./config/session.config')(app);



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use((req, res, next)=>{
  res.locals.theUserObject = req.session.currentUser || null;
  //Making admin global
  let isAdmin = false;
  if (req.session.currentUser && req.session.currentUser.admin) {
    isAdmin = true;
  };
  res.locals.isAdmin = isAdmin;
  // To make an error globaly avaible
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash("success");
  next();
})
// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);


module.exports = app;
