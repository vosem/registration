var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
	assert = require('assert'),
	url = 'mongodb://heroku_nvq9ztl7:8k7mm8jmofmr5m9r0etp429stk@ds139534.mlab.com:39534/heroku_nvq9ztl7'; 

var app = express();
var db; // Create a database variable outside of the database connection callback to reuse the connection pool in app

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());


mongodb.MongoClient.connect(url, function (err, client) {
	assert.equal(null, err);
    console.log('Connection established to', url);

	db = client.db();
	console.log(db);

	    client.close();

});

app.post('/submit', function(req, res) { // это надо сделать в клиентской части
	res.send('Got a POST request');
});


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
});

app.listen(process.env.PORT || 8080);