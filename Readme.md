## Drain Example: Dashboard via Nodejs

An example HTTPS event stream drain in Node.js that computes and dashboards real-time stats.


### Local Testing

Start a Redis database:

    # brew install redis
    $ redis-server

Start the log receiver:

    $ cp .env.sample .env
    $ export $(cat .env)
    $ node web.js

Send it generated data:

    $ LOG_URL=http://127.0.0.1:5000/events node gen.js

View the streaming statistics computed against the events:

    $ curl http://127.0.0.1:5000/stats

See the dashboard rendering the stats:

    $ open http://127.0.0.1:5000/


### Production Testing

Create the drain app, we'll call it `drain-app`:

    $ heroku create -s cedar drain-app
    $ heroku addons:add redistogo
    $ heroku config -a drain-app
    $ heroku config:add REDIS_URL="redis://..."
    $ git push heroku master
    $ heroku scale web=1
    $ heroku logs -t

Send it generated data:

    $ LOG_URL=https://drain-app.herokuapp.com/events node gen.js

View the stats:

    $ curl -i http://drain-app.herokuapp.com/stats

See the dashboard:

    $ heroku open


### Production Usage

Set the drain app's HTTPS URL as a Logplex drain for en emitting app. For example if we we're serving an app called `emit-app`:

    $ heroku drains add https://drain-app.herokuapp.com/events -a emit-app
