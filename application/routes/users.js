var express = require('express');
var router = express.Router();
const db = require('../config/database');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const bcrypt = require('bcrypt');
const { registerValidator } = require('../middleware/validation');
const UserModel = require("../models/users");

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;

  UserModel.usernameExists(username)
  .then((isUsername) => {
    if (isUsername) {
      throw new UserError("Registration Failed: Username already exists.", "/register", 200);
    } else {
      UserModel.emailExists(email);
    }
  })
  .then((isEmail) => {
    if (isEmail) {
      throw new UserError("Registration Failed: Email already exists.", "/register", 200);
    } else {
      return password == passwordConfirm;
    }
  })
  .then((passwordsMatch) => {
    if (!passwordsMatch) {
      throw new UserError("Registration Failed: Passwords do not match.", "/register", 200);
    } else {
      return UserModel.create(username, password, email);
    }
  })
  .then((createdUserId) => {
    if (createdUserId < 0) {
      throw new UserError("Server Error: User could not be created.", "/register", 500);
    } else {
      successPrint("User successfully created!");
      req.flash('success', "Welcome to the tearoom!");
      res.redirect('/login');
    }
  })
  .catch((err) => {
    errorPrint("Your account could not be created.", err);
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect(err.getRedirectURL());
    } else {
      next(err);
    }
  });
});

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  UserModel.authenticate(username, password)
  .then((loggedUserId) => {
    if (loggedUserId > 0) {
      successPrint(`User ${username} is logged in.`);
      req.session.username = username;
      req.session.userId = loggedUserId;
      res.locals.logged = true;
      req.flash('success', "Welcome to the tearoom!");
      res.redirect("/");
    } else {
      throw new UserError("Invalid username and/or password.", "/login", 200);
    }
  })
  .catch((err) => {
    errorPrint("User login failed.");
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      req.flash('error', err.getMessage());
      res.status(err.getStatus());
      res.redirect('/login');
    } else {
      next(err);
    }
  });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("Session could not be destroyed.");
      next(err);
    } else {
      successPrint("Session was destroyed.");
      res.clearCookie("csid");
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.flash("success", "You are now logged out.");
  res.locals.logged = false;
  res.redirect('/');
})

module.exports = router;