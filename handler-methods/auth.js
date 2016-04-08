var authModule = function(req, res, method, path){
  var AUTH = require('../private.js');

  if (!req.headers.authorization){ //If no auth header, no access
    res.writeHead(401, {
      "WWW-Authenticate": "Basic realm='Secure Area'"
    });
    res.end('<html><body>Not Authorized</body></html>');
    return false;
  } //Ends if AUTH
  else { //If auth header exists, check user/pass
    var encodedString = req.headers.authorization.replace("Basic ", "");
    var base64Buffer = new Buffer(encodedString, "base64");
    var decodedString = base64Buffer.toString();
    if (decodedString !== AUTH){
      res.writeHead(401, {
      "WWW-Authenticate": "Basic realm='Secure Area'"
    });
    res.end('<html><body>Invalid Authentication Credentials</body></html>');
    return false;
    }
  } //Ends else AUTH
};
module.exports = authModule;