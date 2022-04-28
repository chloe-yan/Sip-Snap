var express = require('express');
var router = express.Router();
const db = require('../conf/database');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
const bcrypt = require('bcrypt');
const { registerValidator } = require('../middleware/validation');

router.post('/register', registerValidator, (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let passwordConfirm = req.body.passwordConfirm;

  db.execute("SELECT * FROM users WHERE username=?", [username]).then(([results, fields]) => {
    if (results && results.length == 0) {
      return db.execute("SELECT * FROM users WHERE email=?", [email]);
    } else if (password != passwordConfirm) {
      throw new UserError("Registration Failed: Passwords do not match.", "/register", 200);
    } else {
      throw new UserError("Registration Failed: Username already exists.", "/register", 200);
    }
  })
  .then(([results, fields]) => {
    if (results && results.length == 0) {
      return bcrypt.hash(password, 15);
    } else {
      throw new UserError("Registration Failed: Username already exists.", "/register", 200);
    }
  })
  .then((hashedPassword) => {
    let baseSQL = "INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, now());";
    return db.execute(baseSQL, [username, email, hashedPassword]);
  })
  .then(([results, fields]) => {
    if (results && results.affectedRows) {
      successPrint("User successfully created!");
      req.flash('success', "User has been successfully made.");
      res.redirect('/login');
    } else {
      throw new UserError("Server Error: User could not be created.", "/register", 500);
    }
  })
  .catch((err) => {
    errorPrint("User could not be created.", err);
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

  let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
  let userid;
  db.execute(baseSQL, [username, password])
  .then(([results, fields]) => {
    if (results && results.length == 1) {
      let hashedPassword = results[0].password;
      userId = results[0].id;
      return bcrypt.compare(password, hashedPassword);
    } else {
      throw new UserError("Invalid username and/or password.", "/login", 200);
    }
  })
  .then((passwordsMatched) => {
    if (passwordsMatched) {
      successPrint(`User ${username} is logged in.`);
      req.session.username = username;
      req.session.id = userId;
      res.locals.logged = true;
      req.flash('success', "You have been successfully logged in!");
      res.redirect('/');
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
      res.join({status: "OK", message: "User is logged out"});
    }
  });
});

module.exports = router;