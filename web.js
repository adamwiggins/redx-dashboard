var fs = require("fs");
var url = require("url");
var http = require("http");

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

var initSplitter = function() {
  return {last: ""};
}

var applySplitter = function(splitter, data) {
  data = (splitter.last + data);
  var lines = data.split("\n");
  splitter.last = lines[lines.length-1];
  return lines.slice(0, -1);
}

var getSlice = function() {
  return Math.floor((new Date().getTime()) / 1000.0);
}

var initStats = function() {
  return {};
}

var lastKeys = 0;

var updateStats = function(stats, event) {
  console.log("got event.keys = " + event.keys);
  lastKeys = event.keys;
}

var emitStats = function(stats, event) {
  var currentSlice = getSlice();
  var vals = [];
  for (var slice=(currentSlice-20); slice<currentSlice; slice++) {
    vals.push(stats[slice] || 0);
  }
  return vals;
}

var httpHandler = function(stats) {
  return function(req, res) {
    var path = url.parse(req.url).pathname;
    log("http request at=start path=" + path);
    req.setEncoding("utf8");
    if (path == "/") {
      var content = fs.readFileSync("public/index.html");
      res.writeHead(200, {"Content-Type": "text/html",
                          "Content-Length": content.length});
      res.end(content);
    } else if ((path == "/jquery-1.6.2.js") || (path == "/jquery.sparkline.js") || (path == "/dashboard.js")) {
      var content = fs.readFileSync("public" + path);
      res.writeHead(200, {"Content-Type": "application/javascript",
                          "Content-Length": content.length});
      res.end(content);
    } else if (path == "/stats") {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(emitStats(stats)) + "\n");
    } else if (path == "/logs") {
      res.writeHead(200, {"Content-Type": "application/json"});
      req.on("end", function() {
        log("http request at=end");
      });
      req.on("close", function() {
        log("http request at=close");
      });
      var splitter = initSplitter();
      req.on("data", function(data) {
        var lines = applySplitter(splitter, data);
        for (var i=0; i<lines.length; i++) {
          console.log("parsing: " + lines[i]);
          if (lines[i].length > 0) {
            var event = JSON.parse(lines[i]);
            updateStats(stats, event);
          }
        }
      });
    }
  }
}

var port = parseInt(env("PORT"));

log("stats init");
var stats = initStats();

setInterval(function() {
  var slice = getSlice();
  stats[slice] = lastKeys;
  console.log("lastKeys = " + lastKeys);
}, 1000);


var server = http.createServer(httpHandler(stats));
log("http listen port=" + port);
server.listen(port, "0.0.0.0", function() {
  log("http listening port=" + port);
});

process.on("SIGTERM", function() {
  log("trap signal=term");
  log("exit status=0");
  process.exit(0);
});

setInterval(function() {
  log("stats watch vals=" + JSON.stringify(emitStats(stats)));
}, 1000)
