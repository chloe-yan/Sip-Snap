const db = require('../config/database');
const bcrypt = require("bcrypt");
const UserModel = {};
const UserError = require('../helpers/error/UserError');


UserModel.create = (username, password, email) => {
    return bcrypt.hash(password, 15)
    .then((hashedPassword) => {
        let baseSQL = "INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, now());";
        return db.execute(baseSQL, [username, email, hashedPassword]);
    })
    .then(([results, fields]) => {
        if (results && results.affectedRows) {
            return Promise.resolve(results.insertId);
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(err));
}

UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    return db.execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results, fields]) => {
        return Promise.resolve(!(results && results.length == 0));
    })
    .catch((err) => Promise.reject(err));
}

UserModel.authenticate = (username, password) => {
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    let userId;
    return db.execute(baseSQL, [username])
    .then(([results, fields]) => {
        if (results && results.length == 1) {
            let hashedPassword = results[0].password;
            userId = results[0].id;
            return bcrypt.compare(password, hashedPassword);
        } else {
            return Promise.reject(-1);
        }
    })
    .then((passwordsMatched) => {
        if (passwordsMatched) {
            return Promise.resolve(userId);
        } else {
            return Promise.resolve(-1);
        }
    })
    .catch((err) => Promise.reject(new UserError("Invalid username and/or password.", "/login", 200)));
}

module.exports = UserModel;