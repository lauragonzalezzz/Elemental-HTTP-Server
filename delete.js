var deleteModule = function(req, res){
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

          var newLink = "  <li>\n      <a href='./public" + path + "'>" + name + "</a>\n    </li>";

          if (indexData.indexOf(newLink) !== -1){
            indexData = indexData.replace(newLink, '');
          };

          fs.writeFile("./public/index.html", indexData, function(err){
            if (err){
              throw new Error(err);
            }
            res.writeHead(200, {
              "Content-Type": 'application/json',
              "Server": "LG Servers"
            });
            res.write('{"Success" : true}');
            res.end();
          });
        }); //Ends Public readFile
      }); //Ends path readFile
  } //Ends if METHOD === DELETE
} //Ends deleteModule function

module.exports = deleteModule;

//remove check on method