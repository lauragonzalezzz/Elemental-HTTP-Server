var http = require('http');
var fs = require('fs');
var requestHandlerModule = require('./handler-methods/request-handler.js');

http.createServer(function(req, res){
  requestHandlerModule(req, res);
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

