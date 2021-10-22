// var mysql = require('mysql2');

// var dbConnection = mysql.createPool({
//     host:"localhost",
//     connectionLimit: 10,
//     user: "root",
//     password: "root",
//     database: "lulu"
// });

// module.exports = dbConnection;

var mysql = require('mysql');
var settings = {
    server: "localhost",
    database: "Lulu",
    driver: "msnodesqlv8",
    options: {
      trustedConnection: true
    }
  };
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();`