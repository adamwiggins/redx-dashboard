## Drain Example: NodeJS to MongoDB

An example of how to implement an HTTPS event stream drain in Node.js that stores events in a MongoDB database.


### Local Testing

Start a MongoDB database:

    # brew install mongodb
    $ mongod run --config /usr/local/Cellar/mongodb/2.0.1-x86_64/mongod.conf

Start the log receiver:

    $ cp .env.sample .env
    $ export $(cat .env)
    $ node web.js

Send it generated data using the client from the [`drain-example-nodejs`](https://github.com/heroku/drain-example-nodejs) repo:

    $ LOG_URL=http://127.0.0.1:5000 node ../drain-example-nodejs/gen.js

### Production Testing

Create the drain app, we'll call it `drain-app`:

    $ heroku create -s cedar drain-app
    $ heroku addons:add mongolab:small
    $ heroku config:add MONGODB_URL="mongodb://..."
    $ git push heroku master
    $ heroku scale web=1
    $ heroku logs -t

Send it generated data:

    $ LOG_URL=https://drain-app.herokuapp.com node ../drain-example-nodejs/gen.js


### Production Usage

Set the drain app's HTTPS URL as a Logplex drain for en emitting app. For example if we we're serving an app called `emit-app`:

    $ heroku drains add https://drain-app.herokuapp.com -a emit-app
