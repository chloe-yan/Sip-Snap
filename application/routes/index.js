var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors.js').userIsLoggedIn;
var getRecentPosts = require("../middleware/postsmiddleware").getRecentPosts;
var db = require("../conf/database");

/* GET home page. */
router.get('/', getRecentPosts, (req, res, next) => {
  res.render('index', { title: 'Brewer'});
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login'});
})

router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Create your account'});
})

// Check if user is logged in beforehand
router.use('/post',  isLoggedIn);
router.get('/post', (req, res, next) => {
  const questions = ["I am most grateful for...", "My favorite way to spend the day is...", "The words I’d like to live by are...", "I really wish others knew this about me...", "I feel happiest when...", "I couldn’t imagine living without...", "When I'm struggling, the kindest thing I can do for myself is...", "I feel most energized when...", "To my past self,..."];
  var randomQ = questions[Math.floor(Math.random()*questions.length)]
  res.render('post', { title: 'Share your sip', question: randomQ});
})

router.get('/view', (req, res, next) => {
  res.render('view', { title: 'View an image'});
})

router.get("/post/:id(\\d+)", (req, res, next) => {
  let baseSQL = "SELECT u.username, p.title, p.content, p.photopath, p.createdAt FROM users u JOIN posts p ON u.id = p.author_id WHERE p.id=?"
  let postId = req.params.id;
  db.execute(baseSQL, [postId]).then(([results, fields]) => {
    if (results && results.length) {
      let post = results[0];
      var readableDate = post["createdAt"].toString();
      var readableDateArr = readableDate.split(" ");
      readableDate = readableDateArr[1] + " " + readableDateArr[2].replace("0", "") + ", " + readableDateArr[3];
      res.render("view", {currentPost: post, date: readableDate});
    } else {
      req.flash("error", "Post unable to load.")
      res.redirect("/");
    }
  })
});

module.exports = router;