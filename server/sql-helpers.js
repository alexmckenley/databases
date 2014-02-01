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
    var escapedUser = connection.escape(user);
    connection.query('SELECT id FROM users WHERE username=' + escapedUser, function(err, rows){
      if(err){
        console.log("Error: ", err);
      } else {
        if (rows.length === 0) {
          module.exports.addUser(user, function(id){
            userId = id;
            cb(userId);
          });
        } else {
          userId = rows[0].id;
          cb(userId);
        }
      }
    });
  },

  getRoomId: function(roomname, cb){
    var roomId;
    var escapedRoomname = connection.escape(roomname);
    connection.query('SELECT id FROM rooms WHERE roomname=' + escapedRoomname, function(err, rows){
      if(err){
        console.log("Error: ", err);
      } else {
        if (rows.length === 0) {
          module.exports.addRoom(roomname, function(id){
            roomId = id;
            cb(roomId);
          });
        } else {
          roomId = rows[0].id;
          cb(roomId);
        }
      }
    });
  },

  addUser: function(user, cb) {
     var escapedUser = connection.escape(user);
    connection.query('INSERT INTO users (username) VALUES ('+ escapedUser +')', function(err) {
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

    var escapedRoomname = connection.escape(roomname);
    console.log("Adding Room: ", roomname);
    connection.query('INSERT INTO rooms (roomname) VALUES ('+ escapedRoomname +')', function(err) {
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
      values.push(connection.escape(message[key]));
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
  },

  getById: function(table, id, cb) {
    connection.query('SELECT * FROM ' + table + ' WHERE id=' + id, function(err, rows) {
      if(err) {
        cb(false);
      } else {
        cb(rows[0]);
      }
    });
  },

  getMessages: function(cb) {  // Change to return just room messages
    connection.query('SELECT text, username, roomname, createdAt, messages.id FROM messages ' +
      'INNER JOIN users on id_users = users.id INNER JOIN rooms on id_rooms = rooms.id', function(err, rows) {
      if(err){
        cb(false);
      } else {
        cb(rows);
      }
    });
  }
};


















