const db = require('../conf/database');
const PostModel = {};

PostModel.create = (title, description, fileUploaded, thumbnailDestination, author_id) => {
    let baseSQL = "INSERT INTO posts (title, content, photopath, thumbnail, createdAt, author_id) VALUE (?, ?, ?, ?, now(), ?);";
    return db.execute(baseSQL, [title, description, fileUploaded, thumbnailDestination, author_id])
    .then(([results, fields]) => {
        return Promise.resolve(results && results.affectedRows);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSQL = "SELECT id, title, content, thumbnail, concat_ws(' ', title, content) AS haystack FROM posts HAVING haystack LIKE ?"
    return db.execute(baseSQL, ["%" + searchTerm + "%"])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getRecentPosts = (numPosts) => {
    let baseSQL = "SELECT id, title, content, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 8";
    return db.execute(baseSQL)
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
    let baseSQL = "SELECT u.username, p.title, p.content, p.photopath, p.createdAt FROM users u JOIN posts p ON u.id = p.author_id WHERE p.id=?"

    return db.execute(baseSQL, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = PostModel;