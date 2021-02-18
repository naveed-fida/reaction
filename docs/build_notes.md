<!-- TOC -->

- [1. Build Notes](#1-build-notes)
    - [1.1. Redux data structure](#11-redux-data-structure)
    - [1.2. New Board and List Forms](#12-new-board-and-list-forms)
    - [1.3. How to access board id in new list form](#13-how-to-access-board-id-in-new-list-form)
    - [1.4. How to order items](#14-how-to-order-items)
    - [1.5. React-DnD vs Dragula](#15-react-dnd-vs-dragula)
    - [1.6. Card creation local state](#16-card-creation-local-state)
    - [1.7. How to connect dragula to cards and lists simultaneously](#17-how-to-connect-dragula-to-cards-and-lists-simultaneously)
        - [1.7.1. UPDATE](#171-update)
    - [1.8. /cards/:cardId](#18-cardscardid)
        - [1.8.1. Thoughts](#181-thoughts)
        - [1.8.2. Decisions](#182-decisions)
        - [1.8.3. UPDATE](#183-update)
        - [1.8.4. UPDATE 2](#184-update-2)
    - [1.9. Textarea onBlur](#19-textarea-onblur)
    - [1.10. Archiving Cards](#110-archiving-cards)
    - [1.11. Duplicated UI and logic for board/list/position selects on move/copy popovers](#111-duplicated-ui-and-logic-for-boardlistposition-selects-on-movecopy-popovers)
    - [1.12. How to load boards and lists on move/copy card popovers](#112-how-to-load-boards-and-lists-on-movecopy-card-popovers)

<!-- /TOC -->

# 1. Build Notes

## 1.1. Redux data structure

My first thought was to store the data in a nested structure mirroring its relationships:

```javascript
{
  boards: [{
    id: 1
    lists: [{
      id: 1
    }]
  }]
}
```

There are two problems with this:

1. The more child data we have, the deeper our structure  will grow.
2. How do we *start* data retrieval at a piece of data in the middle of the structure?

The resolution I came to was inspired by [this answer](https://stackoverflow.com/a/32921731/617243) by Dan Abramov, creator of redux.

I ended up going with a flat data structure, but didn’t include the child ids of other data in the parents:

```javascript
{
  boards: [{
    id: 1
  },
  lists: [{
    id: 1,
    board_id: 1
  }]
}
```


I also didn’t always end up cleaning up the nested data, but I don’t use it. There is a library called [normalizr](https://github.com/paularmstrong/normalizr) which normalizes json data and would make cleaning up the nested data easy. I would probably use it in a production project.

## 1.2. New Board and List Forms

The new board and list forms require some state:

- Show the form?
- Current text
- Is saving? (Optional)

The tricky part is that these pieces of state need to be modified in two situations:

1. When the user interacts with the form.
2. When the save is complete

\#1 can obviously be handled using local state and event handler functions located in either the component or (preferably) a container component.

\#2 is a little bit more difficult. We don’t want to hide the form until the save completes, in case it fails. We also need to reset the current text when the save completes, so that if the user shows the form again the previous text isn’t displayed.

Since the redux store receives a dispatched action when the save completes, it makes sense to put the form state in the redux store and handle the save completion in a reducer that updates the form state.

That is how I built the app initially. I did this for both boards and lists. When I got to creating cards however, I started to feel that separating the form and the form state between the component and store was both a lot of overhead and work for little reward, and very repetitive. *Every* component which has a similar situation requires its own state in the store, a reducer that must be able to properly handle the events that should trigger state changes, tests for the reducer, etc.

By the third time I needed to implement this pattern, for new cards, I decided I didn’t think it was a good pattern to continue using. I switched to a callback pattern instead. I used the callback pattern for new cards and also card descriptions and found that I really liked it.

After implementing it twice, I decided it was a superior pattern and refactored the board and lists to use this pattern.

The changes were simple. My `createBoard` action creator:

```javascript
export function createBoard(board) {
  return function(dispatch) {
    dispatch(createBoardRequest());
    apiClient.createBoard(board, newBoard => dispatch(createBoardSuccess(newBoard)))
  }
}
```

Became:

```javascript
export function createBoard(board, callback) {
  return function(dispatch) {
    dispatch(createBoardRequest());
    apiClient.createBoard(board, newBoard => {
      dispatch(createBoardSuccess(newBoard))

      if (callback) { callback(newBoard); }
    })
  }
}
```

Then my `onSubmit` handler:

```javascript
onSubmit: function(e) {
  e.preventDefault();

  const newBoard = { title: stateProps.title };

  dispatchProps.dispatch(boardActions.createBoard(newBoard));
}
```

Became:

```javascript
onSubmit: function(e) {
  e.preventDefault();

  const newBoard = { title: stateProps.title };

  dispatchProps.dispatch(
    boardActions.createBoard(newBoard, () => {
      this.setState({
        showForm: false,
        title: ''
      });
    })
  );
}
```

After this, I was able to remove the reducer and all state related to the form from the redux store. The key is that the `apiClient.createBoard ` callback isn’t called if the API call fails (returns an error status code), which means that the callback we passed into the action creator doesn’t get called.

I made this same change for new lists, and the entire app now uses this pattern.

## 1.3. How to access board id in new list form

In order to create a new list, the `CreateListTileContainer` component has to know the board we are currently viewing. It seems that this would be easy because it is in the URL, but it was a little tricky.

While the id is in the URL, the router match data is only available to the component(s) rendered as direct children of the `<Route>` component. That means that I either had to pass it through all child components, now and in the future, from the `BoardContainer` component down to `CreateListTileContainer` or find another way to do it.

My initial implementation was to use `childContextTypes` to place a `currentBoardId` value in the context (global object). Any child component can then opt-in to that context key and gain access to the value.

That worked well, but context is not recommended if there is any way to avoid using it, much like ruby globals.

While building the move card popover, I researched how to manually trigger a URL change. It turns out that `withRouter` is provided by `react-router` (and subsequently by `react-router-dom`) and when used to wrap a component, it attaches the router match data along with the history object to the wrapped component’s props. That allowed me to do: 

```javascript
this.props.history.push(/boards/${sourceBoardId});
```

This code is executed if a card is moved to a different board.

I realized that this was exactly what I needed for `CreateListTileContainer`. By using `withRouter` in that component, I was able to grab the current board id using `this.props.match.params.id`. I no longer needed to use the context to solve the problem.

## 1.4. How to order items

In order to maintain order, lists and cards need some implementation of a position. There is one obvious way to do this: normalized positions such as 1, 2, 3, 4.

The more I thought about this though, the more I realized it was going to require some logic that was unpleasant to maintain.

When updating one item, all of its sibling items would need to be updated with newly normalized positions. I came up with three options:

1. Return an array of the item and its updated siblings from the API.
2. Manually update the siblings locally (an idea I never gave real consideration because it is so bad).
3. After the update request completes, trigger a fetch of the parent which would retrieve the items

All three of these options carried more maintenance contracts than I thought were worth it.

I decided to research how Trello does it, which turned out to be the following rules:

- If the item is the first to be created in the group, it gets a position of 65535.
- If the item is inserted at the beginning of the group, the position becomes half of the previously-first item’s position.
- If the item is inserted at the end of the list, the position becomes the previously-last item’s position plus 65536
- If the item is inserted between two other items, the position becomes `(itemBefore.position + itemAfter.position) / 2`.
- Positions are floats with a high precision (10 digits or so if I remember right).

I quickly realized that this was a really good solution. Reordering only requires changing a single item with this implementation, completely removing the afore-mentioned maintenance nightmare.

I mimicked these rules in my own implementation.

## 1.5. React-DnD vs Dragula

When implementing dragging lists I found React-DnD and Dragula as options. React-DnD was created by a prolific react  community contributor, so I am sure it works fine, but I was unable to get it to work after 20 or so minutes. I decided to try Dragula and was able to get it working in just a couple of minutes using [bevacqua/react-dragula](https://github.com/bevacqua/react-dragula). I highly recommend this library as it has a great API and works flawlessly in my application.

## 1.6. Card creation local state

When creating a new card, there is some local state that needs to be maintained:

* The new form textarea value
* Which list is currently showing the new card form, if any

There is also logic that needs to exist:

* Controlled form input for the text area — store value and pass in an `onChange` callback.
* `onSubmit` callback
* `onClose` callback.

Where should I store these pieces? In my application, the rendered structure looks like this:

```
<Application>
  <BoardContainer>
    <Board>
      <ExistingLists>
        <DraggableList>
          <List>
            <NewCardForm />
          </List>
        </DraggableList>
        <DraggableList>
          <List>
            <NewCardForm />
          </List>
        </DraggableList>
      </ExistingList>
    </Board>
  </BoardContainer>
</Application>
```

Since the state storing which list is currently showing the new form list needs to go in the component which has access to all of the lists, that is `<ExistingLists>`. It made sense to me to put all of the callbacks and state there, since they are all related. I could have also utilized Redux for the state and placed the callback logic much closer to the `<NewCardForm>` component, but I decided it wasn’t worth the added Redux maintenance at this point.


## 1.7. How to connect dragula to cards and lists simultaneously

Many of instances of dragula can be configured on the same page, but nesting drag targets proved to be a little tricky. The way you configure dragula is by setting up “containers”, and their direct descendants will be draggable between each container.

All child elements of the draggable element serve as handles (unless configured otherwise). When you are nesting drag targets, this becomes a problem. When you click on the nested draggable item to drag it, the parent draggable item catches the drag as well, and ends up being the item that is getting dragged. Fortunately, dragula provides us with ways to deal with this.

When initializing a dragula instance, you can provide an options object. One of the keys you can provide a callback function for is called `moves`. If this method returns a truthy value, the draggable item begins dragging. If not, it does nothing. This means we can set some specifics on the parent draggable item, and let the nested draggable item always be draggable. 

When we click on the nested draggable item or any of its descendants, we always want a drag to be initiated for that item, but never the parent draggable item. This is the solution I used:

Parent draggable configuration (ES2015 syntax from [bevacqua/react-dragula](https://github.com/bevacqua/react-dragula)):

```javascript
dragulaDecorator = (componentBackingInstance) => {
  if (componentBackingInstance) {
    let options = {
      direction: 'horizontal',
      moves: function (el, source, handle, sibling) {
        return !handle.closest("#cards-container");
      },
      accepts: function (el, target, source, sibling) {
        return !el.closest("#cards-container");
      }
    };

    dragula([componentBackingInstance], options)
      .on('drop', function (el) {
        el.dispatchEvent(new Event("drop", { "bubbles": true }));
      });
  }
};
```

As previously mentioned, `moves` describes what elements this drake can drag. `!handle.closest(“#cards-container")` says “the clicked page element (`handle`) has no parent with the `cards-container` class.” Using this means that all of the child elements of the lists (drag target here) should initiate a list drag *unless* they have a `#cards-container` parent.

`accepts` is similar to `moves`, except it describes what dragged items this container will accept. Since we don’t want cards to be able to be dragged into the lists container, we set the same constraint, allowing only lists to be dropped in the container.

Nested draggable items configuration:

```javascript
componentDidMount() {
  this.cardDrake = dragula({
    isContainer: function (el) {
      return el.id === 'cards-container';
    }
  });
}
```

The `isContainer` options key allows us to dynamically decide if an element that receives a click is a container or not. Since the card lists are `#cards-container` elements, this sets all card containers to be containers, and allows cards to be dragged between them.

Notice the parallel between the constraints on the parent draggable item and the dynamic container definition for the nested draggable containers.

### 1.7.1. UPDATE

I noticed that sometimes dragging cards didn’t work and would show more than one card element being dragged at once. After playing with it I realized that it was happening after navigating around the app.

The problem ended up being that I was creating the dragula instance in `componentDidMount`, but not cleaning it up in `componentWillUnmount`

## 1.8. /cards/:cardId

When you view a card on Trello, you will notice the card’s board is rendered behind the card.  How do we achieve this as well?

I came up with three options:

1. Render the `Board` component for `/cards/:cardId` and then in the `Board` component’s render function, render the `Card` component if we are on a card url.
2. Render the `Card` component for the `/cards/:cardId`  route and then render the `Board` from the `Card` component’s render function.
3. Create two `<Route>` expressions for `/cards/:cardId`. One would render the board, and the other would render the card.

### 1.8.1. Thoughts
\#1 introduces some logic requirements making sure the `Card` component has a board (or can retrieve it from the API) so that it can be rendered.

\#2 introduces similar requirements, but inverted. The `Board` component has to know how to retrieve the card so it can be displayed.

\#3 introduces a unique requirement that it has to be able to figure out what board to display based only on having the data for a single card.

### 1.8.2. Decisions

\#1 and #2 are asking for trouble since in order to render the component we want, it has to be rendered through another component. This is a potential maintenance nightmare and not good pattern in general.

I decided to go with #3. That is because each component can be told to render itself and the rendering is not co-dependent (although part of the logic in `Board` is, as it needs to retrieve itself using a card id).

The data structure I had used on the API server up 'til this point was “Board has_many Lists, List has_many cards”. Because of this, my next problem arose. How do I get the board through a card’s data? That answer seemed to be simple: look through the lists for the one the card belongs to, then grab the board that list belongs to. 

There is a caveat though. If the board hasn’t been loaded, we don’t have the board’s lists. That means we won’t find the card’s list when we look, which means I *couldn’t* find the board using only the card data.

The solution is to not only have the card belong to the list, but also the list’s board. Once we make this change, we are able to retrieve the board by the card’s `board_id` (achieved in the `BoardContainer`’s `componentDidMount` lifecycle callback). Once this retrieval has happened, `Board` can grab the correct board from the store and display it.

This led me to yet another tricky step. At this point, there are three main possible scenarios when we load the `BoardContainer`:

1. It is a fresh page load, no data is in the store. The route is `/cards/:cardId` which means we don’t have a board id.
2. It is a fresh page load, no data is in the store. The route is `/boards/:boardId` which means we have a board id.
3. The user navigated to `/boards/:boardId` from `/`. We have part of the board data loaded from the API, but not all of it.

Our component needs to handle all of these scenarios as simply as possible.

There is one thing that is true for all three cases: we need to fetch the entire board, since we don’t have that data. The simplest way to do this is to fire off a thunk that fetches the board in the `componentDidMount` lifecycle callback, but therein lies a landmine. Fetching the board is only possible when we have the board id. We only have the board id when we are on `boards/:boardId`.

This is when it gets tricky. I solved it by introducing the following steps:

1. When the component mounts, subscribe to the store.
2. The callback to the subscription checks `this.state.board` and `this.state.isFetching` to see if we have a board yet.
3. If we have a board, nothing is done.
4. If we don’t have a board, I:
    1. Look for a board id. The board id can come from either the url or the current card if we are at `/cards/:cardId`.
    2. If we don’t have a board id (because we have not yet retrieved the current card), do nothing. These same steps will be repeated when the store is updated, thanks to our subscription. When the card is fetched (happening elsewhere in the app), the store will be updated and we will be able to proceed.
    3. Once we have a board id, continue:
        1. Update the `isFetching` state property to `true`. (This makes sure that any future store subscription callback invocations won’t retrieve the board, since we are already working on it)
        2. In the `setState` callback, dispatch the `fetchBoard` thunk, with a callback.
            1. In the callback to the thunk, receive the fetched board.
            2. Update the local state with the board and set `isFetching` to false.

NOTE: I created a method called `updateBoardInState` that encapsulates  kicking off steps 2+. I called this method directly in `componentDidMount` as well as in the subscription callback, because we need it to be executed when the component mounts, and not just when we get an update from the store.

### 1.8.3. UPDATE

I ended up refactoring my subscribe callback because I had two places that modified the state back and forth which got the app stuck in an infinite loop.

```javascript
updateBoardInState = () => {
  const store = this.context.store;
  const boardId = this.boardId();

  if (!boardId) { return null; }

  if (!this.state.board && !this.state.isFetching) {
    this.fetchBoard(boardId);
  }
}
```

The callback function now checks for the board id first. If there is no board is, that means we are on `/cards/:id` and the card hasn’t loaded yet. If we are on `/boards/:id`, the id is available immediately.

### 1.8.4. UPDATE 2

I originally rendered `BoardContainer` in two different routes. I found that this created a visible refresh when I changed between `/cards/:id` and `/boards/:id`. That is because each route rendered its own instance of `BoardContainer`. By only using one instance of that component, react is able to properly transition without the visual refresh of the board data.

 I changed:

```jsx
<Route path='/boards/:boardId' exact component={BoardContainer} />
<Route path='/cards/:cardId' exact component={BoardContainer} />
```

to:

```jsx
<Route path='/(boards|cards)/:id' exact component={BoardContainer} />
```
## 1.9. Textarea onBlur

I ran into a problem where `onblur` interrupts click events, which means that clicking on a save button outside of a textarea with an onblur handler only fires the `onblur`, and not any `onclick` events on the button. The first solution I found for this came from [Stack Overflow](https://stackoverflow.com/a/28963938/617243 "this SO post").

While using `onmousedown` worked, I didn’t consider it a good solution because a button shouldn’t respond to a click until the mouse button is _released_, rather than pressed. I ended up solving this using `setTimeout` and my own `showForm` state property. Here is the code with sample HTML:

```jsx
<textarea onBlur={props.onInputBlur}></textarea>
<button onClick={props.onSaveClick}>{props.isSaving ? "Saving..." : "Save"}</button>
```

```javascript
handleBlur = (e) => {
  e.preventDefault();

  setTimeout(() => {
    if (!this.state.isSaving) {
      this.setState({ showForm: false });
    }
  }, 100);
};

handleSaveClick = (e) => {
  if (this.state.isSaving) { return; }

  const dispatch = this.context.store.dispatch;

  this.setState({ isSaving: true });

  this.context.store.dispatch(
    actions.updateCard(this.props.id, {
      description: this.state.description
    }, (updatedCard) => {
      this.setState({
        description: updatedCard.description,
        isSaving: false,
        showForm: false
      });
    })
  );
};
```
## 1.10. Archiving Cards

When a card is archived, we don’t want to show it anymore.

There are two ways to handle this:

1. Return all cards, including archived items, from the API.
2. Filter the archived cards on the API, returning only active cards.

\#1 is nice because it allows us to easily show archived cards without another
API call. The downside is that we have to remember to always filter out archived
cards from the display when we don't want them.

\#2 is nice because it comes with the bonus that when we fetch a board any
archived cards are automatically removed from our store since they won't be in
the removed data. The only downside here is that we still need to filter
archived cards out of the list view since when we archive a card it will still
be in our store but will be marked as archived. This has to be the case so that
when the card is archived we can render the it with the "Archived" banner across
the top and the "Send to Board" button.

I decided to go with #2 since there is less maintenance overhead.

## 1.11. Duplicated UI and logic for board/list/position selects on move/copy popovers

There is quite a bit of logic and UI involved in the board/list/position portion of the move/copy popover form. Because of that, I extracted the UI to `CardLocationForm` and the logic to `CardLocationFormContainer`. This allows us to render it in both `MoveCardForm` and `CopyCardForm` with only the requirement of passing in a card prop and an `onLocationChange` prop which is a callback function which will be called with an object containing the selected board, list, and position.

This made it easy to duplicate very little logic between the `MoveCardFormContainer` and `CopyCardFormContainer` components.

## 1.12. How to load boards and lists on move/copy card popovers

When you access the move or copy popovers, you are able to choose different boards. The problem is, if you navigated directly to `/cards/:id`, the only board that is in the store is the one the current card belongs to. That means the only board that will be in the boards select is the current one.

To fix this, I fetched all boards when `CardLocationFormContainer` is mounted. This has the added bonus of adding new boards if they are created while the current user is browsing the card. Each time the popover is mounted, the boards are updated.

The next problem was displaying the lists for one of the other boards that we have loaded the base data for (title only, no lists), but haven’t browsed so we don’t have the lists in our store.

My solution to this was fetching the selected board when the dropdown is changed. This loads the lists and the base data for the list’s cards. This has the added bonus of making sure the “positions” list reflects up to date data, since it is based on the number of just-fetched cards in the currently selected list.
