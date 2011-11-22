var http = require("http");

http.createServer(function (req, res) {
  console.log("start");
  req.on("end", function(d) {
    console.log("end");
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("ok\n");
  });
  req.on("close", function(d) {
    console.log("close");
  });
  req.on("data", function(d) {
    console.log("data: " + d);
  });
}).listen(parseInt(process.env.PORT), "0.0.0.0");
console.log("listen");
