var http = require("http");
var https = require("https");
var url = process.env.LOG_URL;

var options = require("url").parse(url);
    options.method = "POST";
    options.path   = options.pathname;
    options.host   = options.hostname;

console.log("connect");
var req = ((options.protocol == "https:" ? https : http)).request(options);

setInterval(function() {
  console.log("emit");
  req.write(JSON.stringify({"timestamp": "2011-08-03T:58:10+00:00", "source": "heroku", "ps": "router", "msg": "GET wombat.heroku.com/ dyno=web.1 queue=0 wait=0ms service=11ms status=200 bytes=2"}) + "\n");
}, 100);

req.on("response", function(res) {
  console.log("response");

  res.on("error", function() {
    console.log("error");
    process.exit(1);
  });

  res.on("end", function() {
    console.log("end");
    process.exit(1);
  });

  res.on("close", function() {
    console.log("close");
    process.exit(1);
  });
});
