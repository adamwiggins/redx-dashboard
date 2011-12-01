var http = require("http");
var https = require("https");
var url = process.env.LOG_URL;

var events = [
  {"timestamp": "2011-08-03T:58:10+00:00", "source": "heroku", "ps": "router", "msg": "GET wombat.heroku.com/ dyno=web.1 queue=0 wait=0ms service=11ms status=200 bytes=2"},
  {"timestamp": "2011-08-03T:58:10+00:00", "source": "app", "ps": "web.1", "msg": "web request method=get path=/ at=start"},
  {"timestamp": "2011-08-03T:58:10+00:00", "source": "app", "ps": "web.2", "msg": "web cache hit key=sidebar elapsed=1.04"}];

var options = require("url").parse(url);
    options.method = "POST";
    options.path   = options.pathname;
    options.host   = options.hostname;

var log = function(m) {
  console.log("gen " + m);
}

var randInt = function(n) {
  return Math.floor(Math.random() * n);
}

log("connect");
var req = ((options.protocol == "https:" ? https : http)).request(options);

req.on("error", function(e) {
  log("error: " + e);
  process.exit(1);
});

req.on("response", function(res) {
  log("response stats=" + res.statusCode);
  res.setEncoding("utf8");

  res.on("end", function() {
    log("end");
    process.exit(1);
  });

  res.on("close", function() {
    log("close");
    process.exit(1);
  });
});

setInterval(function() {
  var t = (new Date().getTime());
  var rate = 10 + 5 * (Math.sin(t / 3000.0));
  console.log("tick rate=" + rate);
  for (var i=0; i<rate; i++) {
    var event = events[randInt(events.length)];
    req.write(JSON.stringify(event) + "\n");
  }
}, 100);
