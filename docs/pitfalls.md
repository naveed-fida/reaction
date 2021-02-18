<!-- TOC -->

- [1. Pitfalls](#1-pitfalls)
    - [1.1. URL params](#11-url-params)
    - [1.2. Clean up after yourself!](#12-clean-up-after-yourself)
    - [1.3. Dev Console](#13-dev-console)

<!-- /TOC -->

# 1. Pitfalls

## 1.1. URL params

URL matches are *strings*. I ran into trouble a few times where I couldn’t figure out why my board or card wasn’t being rendered and the problem ended up being that I was searching for the item using `match === id`.

If coercion is used via the `==` operator, this won’t be a problem. Otherwise it is imperative to remember to call `Number` with the match to turn it into a number. There shouldn’t be any problems using coercion because even if the match was `undefined`, that would be coerced to `0`, and no cards or boards will have that id, so it will function as it should.

## 1.2. Clean up after yourself!

If you create any sort of event listener when the component mounts, it must be cleaned up when the component is unmounted. If this isn’t done, the console will contain mysterious errors because the component is gone but events are trying to access it.

The two most common places I needed this were:

- Clean up dragula events
- Clean up redux store subscriptions.

To clean up a redux store subscription, the code looks like this:

```javascript
componentDidMount() {
  const store = this.context.store;
  this.unsubscribe = store.subscribe(() => this.forceUpdate());
}

componentWillUnmount() {
  this.unsubscribe();
}
```
## 1.3. Dev Console

Keep dev tools open! Even if you are on a tab other than console, you will see the error icon in the upper right of dev tools if a JS error occurs. It is very easy to go down the wrong troubleshooting road if you don’t realize there is an error to read and a stacktrace to evaluate.
