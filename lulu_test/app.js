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

app.get('/map', function (req, res) { res.render('map'); });

var cron = require('node-cron');
cron.schedule('*/5 * * * *', function () {
    var con = require(__base + 'dbConnection');
    con.query("TRUNCATE TABLE ValidEpc", function (err, result) {
        if (err) {
            console.log(err);
        }
        con.query("INSERT INTO ValidEpc (id, productId, storeId, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, idx) SELECT id, productId, storeId, MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX( isSold), MAX(isValid), MAX(idx) FROM EpcMovement GROUP BY storeId, productId, id", function (err, result) {
            if (err) {
                console.log(err);
            }
            con.query("TRUNCATE TABLE LastRead", function (err, result) {
                if (err) {
                    console.log(err);
                }
                con.query("INSERT INTO LastRead (id, productId, idx) SELECT id, productId, MAX(idx) FROM EpcMovement GROUP BY id, productId ", function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Cron ran");
                });
            });
        });
    });
});

module.exports = app;