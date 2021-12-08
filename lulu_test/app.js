global.__base = __dirname + '/';
var express = require('express');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var bodyParser = require('body-parser');

var cons = require('consolidate');
var app = express();
const https = require('https');

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(path.join(__dirname, 'public')));

https.createServer(
    { key: fs.readFileSync("server.key"), cert: fs.readFileSync("server.cert"), }, app).listen(3000, function () {
        console.log("Example app listening on port 3000! Go to https://localhost:3000/");
    });
process.on('uncaughtException', function (err) { console.log(err); });
//do something when app is closing
process.on('exit', function () {

});

//catches ctrl+c event
process.on('SIGINT', function () {

});

app.use('/', require('./controllers/testcontroller'));

app.get('/', function (req, res) {
    __loggedIn = false;
    res.render('index');
});


module.exports = app;