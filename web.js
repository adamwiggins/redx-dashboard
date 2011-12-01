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

var getSlice = function() {
  return Math.floor((new Date().getTime()) / 1000.0);
}

var initStats = function() {
  return {};
}

var updateStats = function(stats, event) {
  if ((event.source == "heroku") && (event.ps == "router")) {
    var slice = getSlice();
    if (stats[slice] != undefined) {
      stats[slice] += 1;
    } else {
      stats[slice] = 0;
    }
  }
}

var emitStats = function(stats, event) {
  var currentSlice = getSlice();
  var vals = [];
  for (var slice=(currentSlice-20); slice<currentSlice; slice++) {
    vals.push(stats[slice] || 0);
  }
  return vals;
}

var gcStats = function(stats) {
  log("stats gc");
  var currentSlice = getSlice();
  for (var slice in stats) {
    if (slice < (currentSlice - 30)) {
      delete stats[slice];
    }
  }
}

var httpHandler = function(stats) {
  return function(req, res) {
    log("http request at=start");
    req.setEncoding("utf8");
    res.writeHead(200, {"Content-Type": "application/json"});

    req.on("end", function() {
      log("http request at=end");
    });

    req.on("close", function() {
      log("http request at=close");
    });

    req.on("data", function(d) {
      var lines = d.split("\n");
      for (var i=0; i<lines.length; i++) {
        var line = lines[i];
        if (line != "") {
          var event = JSON.parse(line);
          updateStats(stats, event);
        }
      }
    });
  }
}

var port = parseInt(env("PORT"));

log("stats init");
var stats = initStats();

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
  gcStats(stats)
}, 2000);

setInterval(function() {
  log("stats watch vals=" + JSON.stringify(emitStats(stats)));
}, 1000)
