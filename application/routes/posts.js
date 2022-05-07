var express = require('express');
var router = express.Router();
var db = require("../conf/database");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var sharp = require("sharp");
var multer = require("multer");
var crypto = require("crypto");
var PostError = require("../helpers/error/PostError");
const jsdom = require("jsdom");
const { query } = require('../conf/database');
const { JSDOM } = jsdom;
const mysql = require('mysql2/promise');
const cors = require('cors');
const port = 3100
const sessions = require('express-session');
const mysqlSession = require('express-mysql-session')(sessions);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/uploads");
    },
    filename: function(req, file, cb) {
        let fileExtension = file.mimetype.split("/")[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExtension}`);
    }
})

var uploader = multer({storage: storage});

router.post("/create", uploader.single("image"), async (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let thumbnailDestination = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let author_id;

    await db.query("SELECT id FROM users WHERE username=?", req.session.username).then(([results, fields]) => {
        author_id = results[0]["id"];
    })
    .catch((err) => {
        throw new PostError("Must be logged in to create a post", "login", 200)
    });

    if (description == null) {
        throw new PostError("Must enter a description", "post", 200);
    } else if (title == null) {
        throw new PostError("Must have a title", "post", 200);
    }

    sharp(fileUploaded).resize(200).toFile(thumbnailDestination).then(() => {
        let baseSQL = "INSERT INTO posts (title, content, photopath, thumbnail, createdAt, author_id) VALUE (?, ?, ?, ?, now(), ?);";
        return db.execute(baseSQL, [title, description, fileUploaded, thumbnailDestination, author_id])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                // req.flash("success", "Your post was successfully created.");
                res.redirect("/");
            } else {
                throw new PostError("Post could not be created.", "post", 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash("error", err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL);
            } else {
                next(err);
            }
        })
    });
});

module.exports = router;