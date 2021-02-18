# Rails + Webpack + React + Heroku

## Where code should live

* Ruby/Rails code should continue to live in its appropriate directory within
  `app`.
* React code should live in `app/javascript/components/`.
* React component unit tests should use the `.test.js` extension and live next
  to the components being tested within `app/javascript/components/`.

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

## Testing

Jest tests which affect state need to dispatch `CLEAR_STORE_DATA` after each
test. If this is not done, the redux store is maintained between tests. I could
not find a way to automatically do this after every test in the suite, and I
could not figure out how to resolve my issue easily using a store mock.
