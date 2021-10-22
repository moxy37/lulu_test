const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'luluuser',
  password: 'Moxy..37Moxy..37',
  database: 'lulu'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
