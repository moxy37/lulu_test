global.__base = __dirname + '/';
var express = require('express');
var path = require('path');
var fs = require('fs');
var formidable = require('formidable');

var bodyParser = require('body-parser');

var cons = require('consolidate');
var app = express();

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.static(path.join(__dirname, 'public')));


app.listen(80, function () {
    console.log('Spartacus Node listening on port 80!');
    var con = require(__base + 'dbConnection');
    con.query("SELECT * FROM AllDept", function (err, list) {
        if (err) {
            console.log(JSON.stringify(err));
        }
        console.log(JSON.stringify(list));
    });
});

process.on('uncaughtException', function (err) { console.log(err); });
//do something when app is closing
process.on('exit', function () {

});

//catches ctrl+c event
process.on('SIGINT', function () {

});

app.use('/', require('./controllers/testcontroller'));

app.get('/', function (req, res) { res.render('index'); });



module.exports = app;