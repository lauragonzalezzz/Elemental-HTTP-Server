var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  method = req.method;
  path = req.url;

  var date = new Date();
  date = date.toUTCString();

  if (method === 'GET'){
    fs.readFile("." + path, function(err, data){
      if (err){
        console.log('theres been a problem, sorry');
        console.log('err',err);
      }
      else {
        res.write(
          "HTTP/1.1 200 OK \n" +
          "date: " + date + "\n" +
          "server: LG Servers \n\n" + data);
        res.end();
      }
    }); //Ends fs.readFile
  } //Ends If Statement

  if (method === 'POST'){
    if (path.lastIndexOf('.') === 0){
      path = "public" + path + ".html";
    console.log('path',path);
    }
    else {
      path = "public" + path;
    }

    var newFile = fs.createWriteStream(path);
    res.pipe(newFile);
    res.on('end', function(){
      newFile.end();
    });
    res.write(
      "HTTP/1.1 200 OK \n" +
      "content-type: application/json \n" +
      "date: " + date + "\n" +
      "server: LG Servers \n\n" + {'Success' : true})
    res.end();
  }
}); //Ends Server


server.listen({port: 8080}, function(){
  var address = server.address();
});

// function returnError(res, date){
//   res.write(
//     "HTTP/1.1 404 Not Found \n" +
//     "date: " + date + "\n" +
//     "server: LG Servers \n\n");
// };