var PostsModel = require("../models/Posts");
const postsMiddleware = {};

postsMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await PostsModel.getRecentPosts(8);
        res.locals.results = results;
        if (results.length == 0) {
            req.flash("error", "No sips in the brewer. Feeling thirsty?");
        }
        next();
    } catch (err) {
        next(err);
    }
    // let baseSQL = "SELECT id, title, content, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8";
    
    // db.execute(baseSQL, [])
    // .then(([results, fields]) => {
    //     res.locals.results = results;
    //     if (results && results.length == 0) {
    //         req.flash("error", "No sips in the brewer. Feeling thirsty?");
    //     }
    //     next();
    // })
    // .catch((err) => next(err));
}

module.exports = postsMiddleware;