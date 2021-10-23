var mysql = require('mysql');

var dbConnection = mysql.createPool({
    host: 'localhost',
    // user: 'luluuser',
    // password: 'Moxy..37Moxy..37',
    user: 'root',
    password: 'root',
    database: 'lulu'
});

module.exports = dbConnection;
