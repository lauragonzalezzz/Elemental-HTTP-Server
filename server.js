var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  var method = req.method;
  var path = req.url;
  var myData = null;

  var date = new Date();
  date = date.toUTCString();

  if (method === 'GET'){
    fs.readFile("." + path, function(err, data){
      if (err){
        returnError(res)
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
    }
    else {
      path = "public" + path;
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
      if (elementName === null) {
        console.log('NOPE');
        returnError(res);
        res.end();
      }
      else {
        res.writeHead(200, {
          "Content-Type": 'application/json',
          "Server": "LG Servers"
        });
        res.write('{"Success" : true}')
        res.end();

      } //ENDS ELSE

      req.on('end', function(){

        var newFile = fs.createWriteStream(path);

        fs.readFile("./template.js", function(err, data){
          if (err){
            console.log('Oh noes! I made a mistake!');
          }
          var tempData = data.toString();

          tempData = tempData.replace("elementName", elementName);
          tempData = tempData.replace("elementSymbol", elementSymbol);
          tempData = tempData.replace("elementAtomicNumber", elementAtomicNumber);
          tempData = tempData.replace("elementDescription", elementDescription);

        newFile.write(tempData);

        newFile.end();
        }); //Ends template.read
      }); //Ends req.on('end')
    }); //Ends req.on('data')
  }  //Ends if METHOD === POST
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
      "server": "LG Servers"
    });
    res.write(data);
    res.end();
  });
};