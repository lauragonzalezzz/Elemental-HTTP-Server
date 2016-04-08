var http = require('http');
var fs = require('fs');
var AUTH = require('./private.js');
var deleteModule = require('./delete.js');
var putModule = require('./put.js');

var server = http.createServer(function(req, res){
  var method = req.method;
  var path = req.url;
  var myData = null;
  var date = new Date();
  date = date.toUTCString();

  if (method === 'GET'){
    fs.readFile("public" + path, function(err, data){
      if (err){
        return returnError(res)
      }
      else {
        res.writeHead(200, {
          "Content-Type": 'text/html',
          "Server": "LG Servers"
        });
        res.write(data);
        return res.end();
      }
    }); //Ends fs.readFile
  } //Ends If Statement

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
    if (path !== "/elements"){
      returnError(res);
    }

    req.on('data', function(data){
      myData = data.toString();
      dataByElement = myData.split('&');

      var elementName = null;
      var elementSymbol = null;
      var elementAtomicNumber = null;
      var elementDescription = null;

      for (var i = 0; i < dataByElement.length; i++){
        if (dataByElement[i].indexOf('elementName') !== -1){
          elementName = dataByElement[i].split("=")[1];
        }
        else if (dataByElement[i].indexOf('elementSymbol') !== -1){
          elementSymbol = dataByElement[i].split("=")[1];
        }
        if (dataByElement[i].indexOf('elementAtomicNumber') !== -1){
          elementAtomicNumber = dataByElement[i].split("=")[1];
        }
        if (dataByElement[i].indexOf('elementDescription') !== -1){
          elementDescription = dataByElement[i].split("=")[1];
        }
      }
      if (elementName === null ||
        elementSymbol === null ||
        elementAtomicNumber === null ||
        elementDescription === null) {
        return returnError(res);
      }

      req.on('end', function(){

        fs.readFile("./template.html", function(err, data){
          if (err){
            process.stdout.write("Oh noes! I made a mistake!");
          }
          var tempData = data.toString()
            .replace("elementName", elementName)
            .replace("elementSymbol", elementSymbol)
            .replace("elementAtomicNumber", elementAtomicNumber)
            .replace("elementDescription", elementDescription);

          fs.writeFile("./public/" + elementName + ".html", tempData, function(err){
            if (err){
              throw new Error(err);
            };
            res.writeHead(200, {
              "Content-Type" : "application/json"
            });
          res.end('{"Success" : true}');
          });

          }); //Ends template.read

        fs.readFile("./public/index.html", function(err, data){
          if (err){
            process.stdout.write("Oh noes! I made a mistake!");
          }
          var indexData = data.toString();
          var newLink = "  <li>\n      <a href='./public/" + elementName + ".html'>" + elementName + "</a>\n    </li>\n  </ol>";

          indexData = indexData.replace("</ol>", newLink);
          fs.writeFile("./public/index.html", indexData, function(err){
            if (err){
              throw new Error(err);
            };
          });
        }); //Ends read index
      }); //Ends req.on('end')
    }); //Ends req.on('data')
  }  //Ends if METHOD === POST

  if (method === 'PUT'){
    putModule(req, res, path);
  }

  if (method === 'DELETE'){
    deleteModule(req, res, path);
  }

}); //Ends Server

server.listen({port: 8080}, function(){
  var address = server.address();
});

function returnError(res){
  fs.readFile('./public/404.html', function(err, data){
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

