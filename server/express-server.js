var express = require('express');
var mysql = require('mysql');
var app = express();

app.use(express.bodyParser());

// Database Connection
var connection = mysql.createConnection({
  user: "root",
  password: "plantlife",
  host: "localhost",
  database: "chat"
});

connection.connect(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/classes/messages', function(req, res){
  res.set(defaultCorsHeaders);

  res.send();
});

app.post('/classes/messages', function(req, res){
  res.set(defaultCorsHeaders);
  if(req.body.username === 'null') { // ToDo: Change this to frontend
    req.body.username = "anonymous";
  }
  sqlHelpers.getUserId(req.body.username);


  res.send();
});

//Serve static files
app.use(express.static(__dirname + '/../client'));
app.listen(8080);

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

//http://localhost:8080/bower_components/backbone/backbone-min.js