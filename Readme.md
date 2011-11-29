## Drain Example: NodeJS

An example of how to implement an HTTPS event stream drain as a NodeJS application deployed to Heroku.


### Local Testing

Start the log receiver:

    $ PORT=5000 node web.js

Send it generated data:

    $ LOG_URL=http://127.0.0.1:5000 node gen.js


### Production Testing

Create the drain app, we'll call it `drain-app`:

    $ heroku create -s cedar drain-app
    $ git push heroku master
    $ heroku scale web=1
    $ heroku logs -t

Send it generated data:

    $ LOG_URL=https://drain-app.herokuapp.com node gen.js


### Production Usage (Speculative)

Set the drain app's HTTPS URL as an Logplex drain for en emitting app. For example if we we're serving an app called `emit-app`:

    $ heroku drains add https://drain-app.herokuapp.com -a emit-app
