var url = require("url");
var mongodb = require("mongodb");

var log = function(m) {
  console.log("test " + m);
}

var mongodbUrl = "mongodb://127.0.0.1:27017/drain-development";
var mongodbOpts = url.parse(mongodbUrl);
log("server");
var server = new mongodb.Server(mongodbOpts.hostname, parseInt(mongodbOpts.port), {"auto_reconnect": true});
log("db");
var db = new mongodb.Db(mongodbOpts.path.slice(1), server, {});
log("open");
db.open(function(e, client) {
  if (e) { throw(e); }
  log("collection");
  var collection = new mongodb.Collection(client, "events");
  log("insert");
  collection.insert({hello: "world"}, {safe: true}, function(e, result) {
    if (e) { throw(e); }
    log("result: " + JSON.stringify(result));
    log("find");
    collection.find().toArray(function(e, result) {
      if (e) { throw(e); }
      log("result: " + JSON.stringify(result));
      log("close");
      client.close();
    });
  });
});
