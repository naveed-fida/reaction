# About
A trello clone built with rails and react

# Rails + Webpack + React + Heroku

## Useful commands

Run JS unit tests:

```
$ bin/yarn run test 
```

Run eslint on files in `app/javascript/`:

```
$ bin/yarn run lint
```

## Deployment hints ([source](https://medium.com/@hpux/rails-5-1-loves-javascript-a1d84d5318b))

1. Add the nodejs and ruby buildpacks:

    ```
    $ heroku create 
    $ heroku buildpacks:add --index 1 heroku/nodejs
    $ heroku buildpacks:add --index 2 heroku/ruby
    ```

This template is deployed
[here](https://obscure-fortress-25974.herokuapp.com/).
