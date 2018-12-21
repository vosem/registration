var express = require('express'),
	http = require('http'),
	path = require('path'),
	bodyParser = require('body-parser'),
	mongodb = require('mongodb'),
	assert = require('assert'),
	jsonParser = express.json(),
	url = 'mongodb://heroku_nvq9ztl7:8k7mm8jmofmr5m9r0etp429stk@ds139534.mlab.com:39534/heroku_nvq9ztl7'; 

var app = express();
var db; // Create a database variable outside of the database connection callback to reuse the connection pool in app

app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());

var data;

app.post('/submit', function(req, res) { // это надо сделать в клиентской части
	data = req.body;
	var mongoResult = 'ffffff';
	mongodb.MongoClient.connect(url, function (err, client) {
		assert.equal(null, err);
	    console.log('Connection established to', url);
		db = client.db();
	    saveData(db, function(){
	    	client.close();
	    });	    
	});
	
	res.send(mongoResult);
	// if(!req.body) return response.sendStatus(400);
	// res.json(`${req.body.email} - ${req.body.password}`);
	// res.json(req.body);
	// res.end();
});

var saveData = function(db, callback) {
  var collection = db.collection('data');
  collection.find({email: data.email}).toArray(function(err, records) {
    assert.equal(err, null);
	if(records.length == 0){
	  collection.insertOne(data, function(err, result) {
	    assert.equal(err, null);
	    console.log("email unique");
	    mongoResult = "email unique";
	    callback(null, mongoResult);
    });
	} else if(records.length > 0){
	    console.log("email duplicates");
	    mongoResult = "email duplicates";
	    callback(null, mongoResult);
	};
  });
};









app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 8080);