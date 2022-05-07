var db = require("../conf/database");
const postsMiddleware = {};

postsMiddleware.getRecentPosts = function(req, res, next) {
    let baseSQL = "SELECT id, title, content, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8";
    db.execute(baseSQL, [])
    .then(([results, fields]) => {
        res.locals.results = results;
        if (results && results.length == 0) {
            req.flash("error", "No posts created yet.");
        }
        next();
    })
    .catch((err) => next(err));
}

module.exports = postsMiddleware;