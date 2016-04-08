var http = require('http');
var fs = require('fs');
var authModule = require('./handler-methods/auth.js');

http.createServer(function(req, res){
  var method = req.method;
  var path = req.url;

  if (method === 'GET'){
    return getModule(req, res, path, returnError);
  }
  authModule(req, res, method, path, returnError);

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

