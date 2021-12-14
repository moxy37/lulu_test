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
const opts = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [fs.readFileSync('cert.pem')]
}

process.on('uncaughtException', function (err) { console.log(err); });
//do something when app is closing
process.on('exit', function () {

});

//catches ctrl+c event
process.on('SIGINT', function () {

});

app.use('/', require('./controllers/testcontroller'));

app.get('/', (req, res) => {
	res.send('<a href="authenticate">Log in using client certificate</a>')
});

app.get('/authenticate', (req, res) => {
	const cert = req.connection.getPeerCertificate()

	if (req.client.authorized) {
		res.render('neomap');
	} else {
		res.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
	}
});

https.createServer(opts, app).listen(3000);

module.exports = app;