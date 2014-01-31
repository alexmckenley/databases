var fs = require('fs');
var url = require('url');

/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
function parseQuery(qstr)
{
  var query = {};
  var a = qstr.split('&');
  for (var i in a)
  {
    var b = a[i].split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
  }

  return query;
}

var storage = fs.readFileSync("./log/messages.json", 'utf8');
if(storage) {
  storage = JSON.parse(storage);
} else {
  storage = [];
}

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);
  var headers = defaultCorsHeaders;

  var statusCode = 200;
  var body = "";
  var path = url.parse(request.url).pathname;

  if(path === "/") {
    path = "/index.html";
  }

  if(path === "/classes/messages"){
    headers['Content-Type'] = "application/json";
    
    if (request.method === "OPTIONS") {
      response.writeHead(statusCode, headers);
      response.end(body);
    }
    if(request.method === "GET"){
      body = JSON.stringify(storage);
    
      response.writeHead(statusCode, headers);
      response.end(body);
    }

    if(request.method === "POST"){
      statusCode = 201;
      var temp = "";

      request.on('data', function (data) {
        temp += data;
      });

      request.on('end', function(){
        body = JSON.parse(temp);
        body.createdAt = (new Date()).toISOString();
        storage.push(body);
        fs.writeFile("./log/messages.json", JSON.stringify(storage), function(err) {
          if(err) {
            console.log("Error ", err);
          } else {
            console.log("File was saved");
          }
        });

        response.writeHead(statusCode, headers);
        response.end(JSON.stringify(body));
      });
    
    }
  } else {
    fs.readFile(__dirname + "/../client" + path, function (err,data) {
      console.log(path);
      if (err) {
        response.writeHead(404);
        response.end(JSON.stringify(err));
        return;
      }
      response.writeHead(200);
      response.end(data);
    });
  }




};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handleRequest = handleRequest;