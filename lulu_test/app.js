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
app.get('/map2', function (req, res) { res.render('map2'); });

var cron = require('node-cron');
cron.schedule('*/30 * * * *', function () {
    var con = require(__base + 'dbConnection');
    var async = require('async');
    async.series([
        function (callback) {
            con.query("DROP TABLE IF EXISTS ValidEpc_Bak", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, idx INTEGER NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId))", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("INSERT INTO ValidEpc_Bak (id, productId, storeId, idx) SELECT id, productId, storeId, MAX(idx) FROM EpcMovement GROUP BY id, productId, storeId ", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("DROP TABLE IF EXISTS ValidEpc", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("RENAME TABLE ValidEpc_Bak TO ValidEpc", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("DROP TABLE IF EXISTS AllStyle_Bak", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 )", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("DROP TABLE IF EXISTS AllStyle", function (err, result) {
                callback();
            });
        },
        function (callback) {
            con.query("RENAME TABLE AllStyle_Bak TO AllStyle", function (err, result) {
                callback();
            });
        }
    ], function (err) {
        if (err) {
            console.log(err);
        }
        console.log("Cron ran");
    });
});

module.exports = app;