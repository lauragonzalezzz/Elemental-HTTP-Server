var http = require('http');

var server = http.createServer(function(res){
  res.on('data', function(){
    var path = http.request('path', function(){
      res.write(
        "HTTP/1.1 200 OK \n" +
        "Date: " + date + "\n" +
        "Server: LG Servers \n\n" + path);
    });
  });
}); //Ends Server

server.listen({port: 8080}, function(){
  var address = server.address();
});