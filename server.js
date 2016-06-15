var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var superhero = require('./app/routes/superhero')();

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

mongoose.connect('MONGODB_URL', options);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

//Log with Morgan
app.use(morgan('dev'));
//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

//Static files
app.use(express.static(__dirname + '/public'));

app.route('/superhero')
	.post(superhero.post)
	.get(superhero.getAll);
app.route('/superhero/:id')
	.get(superhero.getOne);

var server = app.listen(process.env.PORT || 5000, function () {
  console.log('Server running at http://0.0.0.0:' + server.address().port)
})
