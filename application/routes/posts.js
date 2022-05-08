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

router.post("/post", uploader.single("image"), async (req, res, next) => {
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
        let baseSQL = "INSERT INTO posts (title, content, photopath, thumbnail, createdAt, author_id) VALUE (?, ?, ?, ?, ?, ?);";
        let now = new Date().toDateString();
        let dateArray = now.split(" ");
        let date = dateArray[1] + " " + dateArray[2].replace("0", "") + ", " + dateArray[3];
        return db.execute(baseSQL, [title, description, fileUploaded, thumbnailDestination, date, author_id])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                req.flash("success", "Your post was successfully created.");
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

router.get("/search", async (req, res, next) => {
    try {
        let searchTerm = req.query.q;
        if (!searchTerm) {
            res.send({
                resultsStatus: "info",
                message: "No search term given.",
                results: []
            });
        }
        else {
            let baseSQL = "SELECT id, title, content, thumbnail, concat_ws(' ', title, content) AS haystack FROM posts HAVING haystack LIKE ?"
            let [results, fields] = await db.execute(baseSQL, ["%" + searchTerm + "%"])
            if (results && results.length) {
                req.flash("info-success", `${results.length} sips found`);
                res.render("index", {
                    resultsStatus: "info",
                    message: `${results.length} sips found`,
                    results: results
                });
            } else {
                let [results, fields] = await db.execute("SELECT id, title, content, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8", [])
                req.flash("info-error", "We couldn't find any sips related to your search.");
                res.render("index", {
                    resultsStatus: "info",
                    message: "We couldn't find any sips related to your search. Feel free to browse our most recent shares!",
                    results: results
                });
            }
        }
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;