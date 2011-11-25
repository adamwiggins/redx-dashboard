var http = require("http");
var https = require("https");
var url = process.env.LOG_URL;

var options = require("url").parse(url);
    options.method = "POST";
    options.path   = options.pathname;
    options.host   = options.hostname;

console.log("connect");
var req = ((options.protocol == "https:" ? https : http)).request(options);
var ready = false;
var emitted = 0;

setInterval(function() {
  if (ready) {
    emitted += 1;
    console.log("emit");
    req.write(JSON.stringify({"timestamp": "2011-08-03T:58:10+00:00", "source": "heroku", "ps": "router", "msg": "GET wombat.heroku.com/ dyno=web.1 queue=0 wait=0ms service=11ms status=200 bytes=2"}) + "\n");
  } else {
    console.log("wait");
  }
  }, 100);

req.on("error", function(res) {
  console.log("error");
  process.exit(1);
});

req.on("response", function(res) {
  console.log("response");
  res.setEncoding("utf8");

  res.on("data", function(data) {
    var lines = data.split("\n");
    for (var i=0; i<lines.length; i++) {
      var line = lines[i];
      if (line != "") {
        ready = true;
        var message = JSON.parse(line);
        console.log("message: " + JSON.stringify(message) + " compare: " + JSON.stringify({"emitted": emitted}));
      }
    }
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

req.write("\n");
