var postModule = function(req, res, path){
  var fs = require('fs');

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

      fs.readFile("./handler-methods/template.html", function(err, data){
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
        var h3 = indexData.indexOf("<h3>");
        var ol = indexData.indexOf("<ol>");
        var oldLine = indexData.slice(h3, ol);

        var h3Arr = indexData.slice(h3, ol).split(" ");
        var num = Number(h3Arr[3]);
        var newNum = num + 1;
        h3Arr[3] = newNum;
        var newLine = h3Arr.join(" ");

        indexData = indexData.replace("</ol>", newLink);
        indexData = indexData.replace(oldLine, newLine);
        fs.writeFile("./public/index.html", indexData, function(err){
          if (err){
            throw new Error(err);
          };
        });
      }); //Ends read index
    }); //Ends req.on('end')
  }); //Ends req.on('data')
}

module.exports = postModule;
