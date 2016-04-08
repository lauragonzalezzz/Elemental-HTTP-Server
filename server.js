var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  var method = req.method;
  var path = req.url;
  var myData = null;

  var date = new Date();
  date = date.toUTCString();

  if (method === 'GET'){
    fs.readFile("public" + path, function(err, data){
      if (err){
        returnError(res)
      }
      else {
        res.writeHead(200, {
          "Content-Type": 'text/html',
          "Server": "LG Servers"
        });
        res.write(data);
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
      if (elementName === null ||
        elementSymbol === null ||
        elementAtomicNumber === null ||
        elementDescription === null) {
        process.stdout.write('NOPE');
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

        var updatedFile = fs.createWriteStream(path);

        fs.readFile("./template.html", function(err, data){
          if (err){
            process.stdout.write("Oh noes! I made a mistake!");
          }
          var tempData = data.toString();

          tempData = tempData.replace("elementName", elementName);
          tempData = tempData.replace("elementSymbol", elementSymbol);
          tempData = tempData.replace("elementAtomicNumber", elementAtomicNumber);
          tempData = tempData.replace("elementDescription", elementDescription);

        updatedFile.write(tempData);
        updatedFile.end();
        }); //Ends template.read

        fs.readFile("./public/index.html", function(err, data){
          if (err){
            process.stdout.write("Oh noes! I made a mistake!");
          }
          var indexData = data.toString();
          var newLink = "  <li>\n      <a href='" + path + "'>" + elementName + "</a>\n    </li>\n  </ol>";

          indexData = indexData.replace("</ol>", newLink);

          var newIndex = fs.createWriteStream("./public/index.html");
          newIndex.write(indexData);
          newIndex.end();
        });

      }); //Ends req.on('end')
    }); //Ends req.on('data')
  }  //Ends if METHOD === POST

  if (method === 'PUT'){
    fs.readFile("public" + path, function(err, data){
      if (err){
        res.writeHead(500, {
          "Content-Type": "text/html",
          "Server": "LG Servers"
        });
        res.write('{ "error" : "resource "' + path + '" does not exist"}');
        return res.end();
      }
      req.on('data', function(data){
        putData = data.toString();
        dataByElement = putData.split('&');

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
          process.stdout.write('NOPE');
          returnError(res);
          res.end();
        }
        else {
          res.writeHead(200, {
            "Content-Type": 'application/json',
            "Server": "LG Servers"
          });
          res.write('{"Success" : true}');
          process.stdout.write('Success');
          res.end();
        } //ENDS ELSE

        req.on('end', function(){

          var newFile = fs.createWriteStream("public" + path);

          fs.readFile("./template.html", function(err, data){
            if (err){
              process.stdout.write("Oh noes! I made a mistake!");
            }
            var tempData = data.toString();

            tempData = tempData.replace("elementName", elementName);
            tempData = tempData.replace("elementSymbol", elementSymbol);
            tempData = tempData.replace("elementAtomicNumber", elementAtomicNumber);
            tempData = tempData.replace("elementDescription", elementDescription);

            newFile.write(tempData);
            newFile.end();
          }); //Ends template.read

          fs.readFile("./public/index.html", function(err, data){
            if (err){
              process.stdout.write("Oh noes! I made a mistake!");
            }
            var indexData = data.toString();
            var newLink = "  <li>\n      <a href='" + path + "'>" + elementName + "</a>\n    </li>\n  </ol>";

            indexData = indexData.replace("</ol>", newLink);

            var newIndex = fs.createWriteStream("./public/index.html");
            newIndex.write(indexData);
            newIndex.end();
          });
        }); //Ends req.on('end')
      }); //Ends req.on('data')
    }); //Ends fs.readFile
  } //Ends if METHOD === PUT

  if (method === 'DELETE'){
    fs.readFile("public" + path, function(err, data){
      if (err){
        res.writeHead(500, {
          "Content-Type": "text/html",
          "Server": "LG Servers"
        });
        res.write('{ "error" : "resource "' + path + '" does not exist"}');
        return res.end();
      }

      fs.unlink("public" + path);

      fs.readFile("./public/index.html", function(err, data){
        if (err){
          process.stdout.write("Oh noes! I made a mistake!");
        }
        var indexData = data.toString();
        var name = path.replace("/", "");
        name = name.replace(".html", "");
        name = name.charAt(0).toUpperCase() + name.slice(1);

        var newLink = "  <li>\n      <a href='public" + path + "'>" + name + "</a>\n    </li>";

        if (indexData.indexOf(newLink) !== -1){
          indexData = indexData.replace(newLink, '');
        };


        var newIndex = fs.createWriteStream("./public/index.html");
        newIndex.write(indexData);
        newIndex.end();
      });

      res.writeHead(200, {
        "Content-Type": 'application/json',
        "Server": "LG Servers"
      });
      res.write('{"Success" : true}');
      process.stdout.write('Success\n');
      res.end();
    }); //Ends Public readFile
  } //Ends if METHOD === DELETE


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

