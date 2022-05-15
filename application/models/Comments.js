var db = require("../config/database");
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSQL = `INSERT INTO comments (comment_author_id, comment_post_id, message, createdAt) VALUES (?, ?, ?, now())`;
    return db.query(baseSQL, [userId, postId, comment])
    .then(([results, fields]) => {
        if (results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

CommentModel.getCommentsForPost = (postId) => {
    let baseSQL = `SELECT c.comment_author_id, u.username, c.message, c.createdAt, c.id FROM comments c JOIN users u ON u.id = c.comment_author_id WHERE c.comment_post_id=? ORDER BY c.createdAt DESC`;
    return db.query(baseSQL, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = CommentModel;