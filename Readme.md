## Drain Example: Dashboard via Nodejs

An example HTTPS event stream drain in Node.js that computes and dashboards real-time stats.


### Local Testing

Start the log receiver:

    $ cp .env.sample .env
    $ export $(cat .env)
    $ node web.js

Send it generated data:

    $ LOG_URL=http://127.0.0.1:5000/events node gen.js

See the calculated stats:

    $ watch -n 1 'curl -s http://127.0.0.1:5000/stats'

See the dashboard rendering the stats:

    $ open http://127.0.0.1:5000/


### Production Testing

Create the drain app, we'll call it `drain-app`:

    $ heroku create -s cedar drain-app
    $ git push heroku master
    $ heroku scale web=1
    $ heroku logs -t

Send it generated data:

    $ LOG_URL=https://drain-app.herokuapp.com/events node gen.js

See the stats:

    $ watch -n 1 'curl -s http://drain-app.herokuapp.com/stats'

See the dashboard:

    $ heroku open


### Production Usage

Set the drain app's HTTPS URL as a Logplex drain for en emitting app. For example if we we're serving an app called `emit-app`:

    $ heroku drains add https://drain-app.herokuapp.com/events -a emit-app
