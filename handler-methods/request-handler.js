var requestHandlerModule = function(req, res, returnError){

  var authModule = require('../handler-methods/auth.js');
  var deleteModule = require('../handler-methods/delete.js');
  var putModule = require('../handler-methods/put.js');
  var postModule = require('../handler-methods/post.js');
  var getModule = require('../handler-methods/get.js');
  var method = req.method;
  var path = req.url;

  if (method === 'GET'){
    return getModule(req, res, path, returnError);
  }

  authModule(req, res);
  if (authModule(req, res) === false){
    return;
  }
  else {
    if (method === 'POST'){
      postModule(req, res, path, returnError);
    }

    if (method === 'PUT'){
      putModule(req, res, path, returnError);
    }

    if (method === 'DELETE'){
      deleteModule(req, res, path);
    }
  };
  return res.end();
};

module.exports = requestHandlerModule;