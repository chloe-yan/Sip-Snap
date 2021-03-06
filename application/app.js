const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const { requestPrint, successPrint } = require('./helpers/debug/debugprinters');
const mysql = require('mysql2/promise');
const cors = require('cors');
const port = 3100
const sessions = require('express-session');
const mysqlSession = require('express-mysql-session')(sessions);
const flash = require('express-flash');
const db = require('./config/database.js');

const app = express();
app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {
      emptyObject: (obj) => {
        return !(obj.constructor === Object && Object.keys(obj).length == 0);
      }
    }, //adding new helpers to handlebars for extra functionality
  })
);

var mysqlSessionStore = new mysqlSession({/* using default options */}, require('./config/database.js'));

app.use(sessions({
  key: "csid",
  secret: "top secret key",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  requestPrint(`Method ${req.method}, Route: ${req.url}`);
  next();
})

app.use(express.json());
app.use(cors());

app.use(favicon(__dirname + '/public/images/icon.png'));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get('/users', (req, res) => {
  db.query("SELECT * FROM users")
  .then(([results, fields]) => {
    res.json(results);
  })
  .catch(err => res.json(err));
})

app.get('/posts', (req, res) => {
  db.query("SELECT * FROM posts")
  .then(([results, fields]) => {
    res.json(results);
  })
  .catch(err => res.json(err));
})

app.get('/posts/:id{\\d+}', (req, res) => {
  let _id = req.params.id;
  db.query("SELECT * FROM posts WHERE id=?", [_id])
  .then(([results, fields]) => {
    res.json(results);
  })
  .catch(err => res.json(err));
})

app.post('/posts', async (req, res) => {
  let (title, content, author_id) = req.body;
  try {
    let [results, fields] = await db.query("INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)", [title, content, author_id]);
    res.json(results);
  } catch (err) {
    res.json(err);
  }
})

app.use((req, res, next) => {
  if (req.session.username) {
    res.locals.logged = true;
  }
  next();
})

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})
  

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  successPrint("User was created!")
  // render the error page
  res.status(err.status  || 500);
  res.render("error");
});

module.exports = app;