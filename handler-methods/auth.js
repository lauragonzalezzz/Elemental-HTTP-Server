var authModule = function(req, res, method, path, returnError){
  var AUTH = require('../private.js');
  var deleteModule = require('../handler-methods/delete.js');
  var putModule = require('../handler-methods/put.js');
  var postModule = require('../handler-methods/post.js');
  var getModule = require('../handler-methods/get.js');

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
    postModule(req, res, path, returnError);
  }

  if (method === 'PUT'){
    putModule(req, res, path, returnError);
  }

  if (method === 'DELETE'){
    deleteModule(req, res, path, returnError);
  }
};
module.exports = authModule;