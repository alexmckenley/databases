var express = require('express');
var mysql = require('mysql');
var sqlHelpers = require('./sql-helpers');
var app = express();

app.use(express.bodyParser());

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
   if(req.body.roomname === undefined) { // ToDo: Change this to frontend
    req.body.roomname = "lobby";
   }

  var message = { text: req.body.text };
  sqlHelpers.getUserId(req.body.username, function(id) {
    message.id_users = id;

    sqlHelpers.getRoomId(req.body.roomname, function(id) {
      message.id_rooms = id;

      sqlHelpers.addMessage(message, function(id) {
        res.send("Created message: ", id);
      });
    });
  });
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