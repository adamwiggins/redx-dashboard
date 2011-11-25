var http = require("http");

var server = http.createServer(function(req, res) {
  console.log("request");
  req.setEncoding("utf8");
  res.writeHead(200, {"Content-Type": "application/json"});

  var received = 0;
  var receivedTick = function() {
    var message = {"received": received};
    console.log("message: " + JSON.stringify(message));
    res.write(JSON.stringify(message));
  };
  receivedTick();
  var receivedInterval = setInterval(receivedTick, 1000);

  req.on("end", function(d) {
    console.log("end");
    clearInterval(receivedInterval);
    receivedTick();
    res.end();
  });

  req.on("close", function(d) {
    console.log("close");
    clearInterval(receivedInterval);
  });

  req.on("data", function(d) {
    var lines = d.split("\n");
    for (var i=0; i<lines.length; i++) {
      var line = lines[i];
      if (line != "") {
        var event = JSON.parse(line);
        console.log("event: " + JSON.stringify(event));
        received += 1;
      }
    }
  });
});

server.listen(parseInt(process.env.PORT), "0.0.0.0");
console.log("listen");
