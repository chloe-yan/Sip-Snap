const {getRecentPosts, getPostById} = require("../models/Posts");
const postsMiddleware = {};
const { getCommentsForPost } = require("../models/Comments");

postsMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await getRecentPosts(8);
        res.locals.results = results;
        if (results.length == 0) {
            req.flash("error", "No sips in the brewer. Feeling thirsty?");
        }
        next();
    } catch (err) {
        next(err);
    }
}

postsMiddleware.getPostById = async function(req, res, next) {
    try {
        let postId = req.params.id;
        let results = await getPostById(postId);
        if (results && results.length) {
            res.locals.currentPost = results[0];
            res.locals.avatar = (results[0]["id"] % 5) + 1;
            var readableDate = results[0]["createdAt"].toString();
            var readableDateArr = readableDate.split(" ");
            readableDate = readableDateArr[1] + " " + readableDateArr[2].replace("0", "") + ", " + readableDateArr[3];
            res.locals.date = readableDate;
            next();
        } else {
            req.flash("error", "Sorry, we couldn't find the sip you were looking for!");
            res.redirect("/");
        }
    } catch (err) {
        next(err);
    }
}

postsMiddleware.getCommentsByPostId = async function(req, res, next) {
    let postId = req.params.id;
    try {
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = postsMiddleware;