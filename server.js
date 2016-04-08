var http = require('http');
var fs = require('fs');
var AUTH = require('./private.js');
var deleteModule = require('./delete.js');
var putModule = require('./put.js');
var postModule = require('./post.js');
var getModule = require('./get.js');

http.createServer(function(req, res){
  var method = req.method;
  var path = req.url;

  if (method === 'GET'){
    return getModule(req, res, path, returnError);
  }

  if (!req.headers.authorization){ //If no auth header, no access
    res.writeHead(401, {
      "WWW-Authenticate": "Basic realm='Secure Area'"
    });
    return res.end('<html><body>Not Authorized</body></html>');
  } //Ends if AUTH
  else { //If auth header exists, check user/pass
    var encodedString = req.headers.authorization.replace("Basic ", "");
    var base64Buffer = new Buffer(encodedString, "base64");
    var decodedString = base64Buffer.toString();
    if (decodedString !== AUTH){
      res.writeHead(401, {
      "WWW-Authenticate": "Basic realm='Secure Area'"
    });
    return res.end('<html><body>Invalid Authentication Credentials</body></html>');
    }
  } //Ends else AUTH

  if (method === 'POST'){
    postModule(req, res, path);
  }

  if (method === 'PUT'){
    putModule(req, res, path);
  }

  if (method === 'DELETE'){
    deleteModule(req, res, path);
  }

}).listen({port: 8080}, function(){
  process.stdout.write('Server is listening on port 8080\n');
});

function returnError(res){
  return fs.readFile('./public/404.html', function(err, data){
    if (err){
      throw new Error(err);
    }
    res.writeHead(404, {
      "Content-Type": "text/html",
      "Server": "LG Servers"
    });
    res.write(data);
    return res.end();
  });
};

