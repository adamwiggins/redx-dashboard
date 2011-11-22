## Drain Example: NodeJS

An example of how to implement a Logplex Drain as a NodeJS application deployed to Heroku.


### Usage

    $ cd drain-example-nodejs
    $ heroku create -s cedar
    $ heroku config:add AUTH=u:p
    $ git push heroku master
    $ heroku scale web=1

    $ heroku logs:drains add https://u:p@stormy-cloud-2482.herokuapp.com/logs -a other-app
    
    $ heroku logs -t -a drain-example-nodejs
