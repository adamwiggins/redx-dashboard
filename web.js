var url = require("url");
var http = require("http");
var mongodb = require("mongodb");

var log = function(m) {
  console.log("web " + m);
}

var env = function(k) {
  if (process.env[k]) {
    return process.env[k];
  } else {
    throw("missing process.env[" + k + "]");
  }
}

var httpHandler = function(mongoColl) {
  return function(req, res) {
    log("http request at=start");
    req.setEncoding("utf8");
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write("\n");

    req.on("end", function() {
      log("http request at=end");
    });

    req.on("close", function() {
      log("http request at=close");
    });

    req.on("data", function(d) {
      log("http request at=data");
      var lines = d.split("\n");
      for (var i=0; i<lines.length; i++) {
        var line = lines[i];
        if (line != "") {
          var event = JSON.parse(line);
          log("mongo store at=start");
          mongoColl.insert(event, {safe: true}, function(e, result) {
            if (e) { throw(e); }
            log("mongo store at=finish");
          });
        }
      }
    });
  }
}

var mongoOpts = url.parse(env("MONGODB_URL"));
var httpPort = parseInt(env("PORT"));

var mongoServer = new mongodb.Server(mongoOpts.hostname, parseInt(mongoOpts.port), {"auto_reconnect": true});
var db = new mongodb.Db(mongoOpts.path.slice(1), mongoServer, {});
log("mongo open");
db.open(function(e, client) {
  if (e) { throw(e); }
  log("mongo opened");
  var mongoColl = new mongodb.Collection(client, "events");
  var httpServer = http.createServer(httpHandler(mongoColl));
  log("http listen port=" + httpPort);
  httpServer.listen(httpPort, "0.0.0.0", function() {
    log("http listening port=" + httpPort);
  });
});

process.on("SIGTERM", function() {
  log("trap signal=term");
  log("exit status=0");
  process.exit(0);
});
