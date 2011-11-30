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

Send it generated data:

    $ LOG_URL=http://127.0.0.1:5000 node gen.js

Inspect the events stored in mongodb:

    $ mongo
    > use drain-development
    > db.events.count();
    > db.events.find();
    > db.events.find({ps: "web.1"});

### Production Testing

Create the drain app, we'll call it `drain-app`:

    $ heroku create -s cedar drain-app
    $ heroku addons:add mongolab:small
    $ heroku config -a drain-app
    $ heroku config:add MONGODB_URL="mongodb://..."
    $ git push heroku master
    $ heroku scale web=1
    $ heroku logs -t

Send it generated data:

    $ LOG_URL=https://drain-app.herokuapp.com node gen.js

See what got stored in MongoDB:

    $ mongo
    > conn = new Mongo("host:port")
    > db = conn.getDB("db")
    > db.auth("user", "pass")
    > db.events.count();


### Production Usage

Set the drain app's HTTPS URL as a Logplex drain for en emitting app. For example if we we're serving an app called `emit-app`:

    $ heroku drains add https://drain-app.herokuapp.com -a emit-app
