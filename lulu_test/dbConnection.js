var mysql = require('mysql');

var dbConnection = mysql.createPool({
    host: 'localhost',
    user: 'luluuser',
    password: 'Moxy..37Moxy..37',
    database: 'lulu2'
});

module.exports = dbConnection;
