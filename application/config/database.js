const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'photodb',
    password: '0826'
});

module.exports = db.promise();