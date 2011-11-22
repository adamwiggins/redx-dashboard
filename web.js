var http = require("http");

http.createServer(function (req, res) {
  console.log("start");
  req.setEncoding("utf8");
  req.on("end", function(d) {
    console.log("end");
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("ok\n");
  });
  req.on("close", function(d) {
    console.log("close");
  });
  req.on("data", function(d) {
    var lines = d.split("\n");
    for (var i=0; i<lines.length; i++) {
      var line = lines[i];
      if (line != "") {
        var event = JSON.parse(line);
        console.log("event: " + [event.timestamp, event.source, event.ps, event.msg]);
      }
    }
  });
}).listen(parseInt(process.env.PORT), "0.0.0.0");
console.log("listen");
