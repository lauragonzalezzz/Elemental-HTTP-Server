var getMethod = function(req, res, path, returnError){
  var fs = require('fs');

  return fs.readFile("public" + path, function(err, data){
    if (err){
      return returnError(res);
    }
    else {
      res.writeHead(200, {
        "Content-Type": 'text/html',
        "Server": "LG Servers"
      });
      res.write(data);
      return res.end();
    }
  });
}

module.exports = getMethod;