var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-Parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


// defining the model
var toDo = mongoose.model('ToDo', {
	text : String
})


// defining the routes
 app.get('/api/todos', function (req, res){
 	toDo.find(function (err, todos)
 	{
 		if(err)
 			res.send(err);

 		res.json(todos);
 	})
 })

app.post('/api/todos', function (req, res) {
	toDo.Create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if(err)
			res.send(err);

		toDo.find(function (err, todos)
		{
			if(err)
				res.send(err);
			res.json(todos);
		})
	})
})

app.delete('/api/todos/:todo_id', function (req, res) {
	toDo.remove({
		_id : req.params.todo_id
	}, function (err, todo) {
		if(err)
			res.send(err);

		toDo.find(function (err, todos) {
			if(err)
				res.send(err);
			res.json(todos);
		})
	})
})


// listen (start app with node server.js) ======================================
var server = app.listen(8080, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("app listening at http:// %s %s", host, port);
});