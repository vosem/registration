var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
	assert = require('assert');
	// var url = "mongodb://heroku_nvq9ztl7:8k7mm8jmofmr5m9r0etp429stk@ds139534.mlab.com:39534/heroku_nvq9ztl7";

var app = express();
var db; // Create a database variable outside of the database connection callback to reuse the connection pool in app

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());

var data;

app.post('/submit', function(req, res) {
	data = req.body;
	mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function (err, client) {
		assert.equal(null, err);
	    console.log('Connection established to', url);
		db = client.db();
	    saveData(db, function(response){
	    	client.close();
	    	console.log(response);
	    	res.json(response);
	    });
	});
});

var saveData = function(db, callback) {
  var collection = db.collection('data');
  collection.find({login: data.login}).toArray(function(err, records) {
    assert.equal(err, null);
	if(records.length == 0){
	  collection.insertOne(data, function(err, result) {
	    assert.equal(err, null);
	    return callback('unique');
    });
	} else if(records.length > 0){
	    return callback('duplicate');
	};
  });
};

app.post('/load', function(req, res) {
	data = req.body;
	mongodb.MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function (err, client) {
		assert.equal(null, err);
	    console.log('Connection established to', url);
		db = client.db();
	    getData(db, function(response){
	    	client.close();
	    	console.log(response);
	    	res.json(response);
	    });
	});
});

var getData = function(db, callback) {
  var collection = db.collection('data');
  collection.find({login: data.login, password: data.password}).toArray(function(err, records) {
    assert.equal(err, null);
	if(records.length == 0){
	    assert.equal(err, null);
	    return callback('denied');
	} else if(records.length > 0){
	    return callback('permitted');
	};
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
  console.log(url);
});

app.listen(process.env.PORT || 8080);