var mysql = require('mysql');

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

module.exports = {

  getUserId: function(user, cb){
    var userId;
    user = connection.escape(user);
    connection.query('SELECT id FROM users WHERE username="' + user + '"', function(err, rows){
      if(err){
        console.log("Error: ", err);
      } else {
        if (rows.length === 0) {
          module.exports.addUser(user, function(id){
            userId = id;
          });
        } else {
          userId = rows[0].id;
        }
      }
      cb(userId);
    });
  },

  getRoomId: function(roomname, cb){
    var roomId;
    roomname = connection.escape(roomname);
    connection.query('SELECT id FROM rooms WHERE roomname="' + roomname + '"', function(err, rows){
      if(err){
        console.log("Error: ", err);
      } else {
        if (rows.length === 0) {
          module.exports.addRoom(roomname, function(id){
            roomId = id;
          });
        } else {
          roomId = rows[0].id;
        }
      }
      cb(roomId);
    });
  },

  addUser: function(user, cb) {
    connection.query('INSERT INTO users (username) VALUES ("'+user+'")', function(err) {
      if(err) {
        console.log("Error: ", err);
        cb(false);
      } else {
        module.exports.getUserId(user, function(id) {
          cb(id);
        });
      }
    });
  },

  addRoom: function(roomname, cb) {
    connection.query('INSERT INTO rooms (roomname) VALUES ("'+roomname+'")', function(err) {
      if(err) {
        console.log("Error: ", err);
        cb(false);
      } else {
        module.exports.getRoomId(roomname, function(id) {
          cb(id);
        });
      }
    });
  },
  //      sqlHelpers.addMessage(message, function(id) {

  addMessage: function(message, cb) {
    var keys = [];
    var values = [];
    for(var key in message){
      keys.push(key);
      values.push(JSON.stringify(message[key]));
    }


    console.log('INSERT INTO messages (' + keys.join(',') + ') VALUES ('+ values.join(',') +')');
    connection.query('INSERT INTO messages (' + keys.join(',') + ') VALUES ('+ values.join(',') +')', function(err) {
      if(err) {
        console.log("Error: ", err);
        cb(false);
      } else {
        // module.exports.getMessageId(roomname, function(id) {
        cb(true);
        // });
      }
    });
  }
};


















