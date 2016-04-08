var putMethod = function(req, res, path){
  var fs = require('fs');
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
        return returnError(res);
      }
      else {
        res.writeHead(200, {
          "Content-Type": 'application/json',
          "Server": "LG Servers"
        });
        res.write('{"Success" : true}');
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
  }); //Ends fs.readFile}
} //Ends module

module.exports = putMethod;