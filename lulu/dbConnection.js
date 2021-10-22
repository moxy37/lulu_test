var mysql = require('mysql2');

var dbConnection = mysql.createPool({
    host:"localhost",
    connectionLimit: 10,
    user: "luluuser",
    password: "Moxy..37",
    database: "lulu"
});

module.exports = dbConnection;
