<!-- TOC -->

- [1. Redux Store](#1-redux-store)
    - [1.1. BoardsReducer](#11-boardsreducer)
        - [1.1.1. FETCH_BOARDS_SUCCESS](#111-fetch_boards_success)
        - [1.1.2. CREATE_BOARD_SUCCESS](#112-create_board_success)
        - [1.1.3. FETCH_BOARD_SUCCESS](#113-fetch_board_success)
    - [1.2. ListsReducer](#12-listsreducer)
        - [1.2.1. CREATE_LIST_SUCCESS](#121-create_list_success)
        - [1.2.2. UPDATE_LIST_SUCCESS](#122-update_list_success)
        - [1.2.3. FETCH_BOARD_SUCCESS](#123-fetch_board_success)
    - [1.3. StatusReducer](#13-statusreducer)
        - [1.3.1. FETCH_BOARDS_REQUEST](#131-fetch_boards_request)
        - [1.3.2. FETCH_BOARDS_SUCCESS](#132-fetch_boards_success)
        - [1.3.3. FETCH_BOARD_REQUEST](#133-fetch_board_request)
        - [1.3.4. FETCH_BOARD_SUCCESS](#134-fetch_board_success)
    - [1.4. CardsReducer](#14-cardsreducer)
        - [1.4.1. FETCH_BOARD_SUCCESS](#141-fetch_board_success)
        - [1.4.2. CREATE_CARD_SUCCESS](#142-create_card_success)
        - [1.4.3. FETCH_CARD_SUCCESS](#143-fetch_card_success)
        - [1.4.4. UPDATE_CARD_SUCCESS](#144-update_card_success)
        - [1.4.5. CREATE_COMMENT_SUCCESS](#145-create_comment_success)
    - [1.5. CommentsReducer](#15-commentsreducer)
        - [1.5.1. CREATE_COMMENT_SUCCESS](#151-create_comment_success)
        - [1.5.2. FETCH_CARD_SUCCESS](#152-fetch_card_success)
    - [1.6. ActionsReducer](#16-actionsreducer)
        - [1.6.1. FETCH_CARD_SUCCESS](#161-fetch_card_success)
        - [1.6.2. UPDATE_CARD_SUCCESS](#162-update_card_success)
    - [1.7. ColorsReducer](#17-colorsreducer)
        - [1.7.1. TOGGLE_COLORBLIND](#171-toggle_colorblind)

<!-- /TOC -->

# 1. Redux Store

The store has the following keys and relevant reducers:

- boards
- lists
- status
- cards
- comments
- actions
- colors

Within each of the reducers, `state` is the relevant portion of the state to that reducer. For example, `state` within `BoardsReducer` is the value of the overall store’s `boards` state key.

## 1.1. BoardsReducer

This reducer reacts to the following action types:

- `FETCH_BOARDS_SUCCESS`
- `CREATE_BOARD_SUCCESS`
- `FETCH_BOARD_SUCCESS`

### 1.1.1. FETCH_BOARDS_SUCCESS

The returned state is the value of `action.boards`.

### 1.1.2. CREATE_BOARD_SUCCESS

The returned state is the value of `state` with `action.board` concatenated to it.

### 1.1.3. FETCH_BOARD_SUCCESS

The returned value is the value of `state` with the board either overwritten with `action.board`, or `action.board` concatenated to it if it didn’t exist.

## 1.2. ListsReducer

This reducer reacts to the following action types:

- `CREATE_LIST_SUCCESS`
- `UPDATE_LIST_SUCCESS`
- `FETCH_BOARD_SUCCESS`

### 1.2.1. CREATE_LIST_SUCCESS

The returned value is the value of `state` with `action.updatedList` concatenated to it.

### 1.2.2. UPDATE_LIST_SUCCESS

The returned value is the value of `state` with the list overwritten with `action.list`.

### 1.2.3. FETCH_BOARD_SUCCESS

The return value is the value of `state` with `action.board.lists` replacing all of the lists from the fetched board. It is important to note that each list’s cards are filtered out of the data that is returned.

## 1.3. StatusReducer

This reducer reacts to the following action types:

- `FETCH_BOARDS_REQUEST`
- `FETCH_BOARDS_SUCCESS`
- `FETCH_BOARD_REQUEST`
- `FETCH_BOARD_SUCCESS'`

### 1.3.1. FETCH_BOARDS_REQUEST

`'FETCHING_BOARDS '` is returned.

### 1.3.2. FETCH_BOARDS_SUCCESS

`'BOARDS_FETCHED_SUCCESSFULLY'` is returned.

### 1.3.3. FETCH_BOARD_REQUEST

`'FETCHING_BOARD'` is returned.

### 1.3.4. FETCH_BOARD_SUCCESS

`'FETCHED_BOARD_SUCCESSFULLY'` is returned.

## 1.4. CardsReducer

This reducer reacts to the following action types:

- `FETCH_BOARD_SUCCESS`
- `CREATE_CARD_SUCCESS`
- `FETCH_CARD_SUCCESS`
- `UPDATE_CARD_SUCCESS`
- `CREATE_COMMENT_SUCCESS`

### 1.4.1. FETCH_BOARD_SUCCESS

The value returned is the current `state` value with all of the cards from all of the fetched board’s lists replaced with the data from `action.board.lists[].cards[]`. Any cards which did not previously exist are added to the returned data.

### 1.4.2. CREATE_CARD_SUCCESS

The current `state` is returned with `action.card` concatenated to it.

### 1.4.3. FETCH_CARD_SUCCESS

The value of `state` is returned with `action.card` either replaced within it or concatenated to it.

### 1.4.4. UPDATE_CARD_SUCCESS

The value of `state` is returned with `action.card` replacing the updated card within it.

### 1.4.5. CREATE_COMMENT_SUCCESS

The value of `state` is returned with the `comments_count` property of the comment’s card incremented.

## 1.5. CommentsReducer

This reducer reacts to the following action types:

- `CREATE_COMMENT_SUCCESS`
- `FETCH_CARD_SUCCESS`

### 1.5.1. CREATE_COMMENT_SUCCESS

The value of `state` is returned with `action.comment` concatenated to it.

### 1.5.2. FETCH_CARD_SUCCESS

The value of `state` is returned with `action.card.comments` replacing all of the card’s comments within it. Any comments which did not exist are concatenated to `state`.

## 1.6. ActionsReducer

This reducer reacts to the following action types:

- `FETCH_CARD_SUCCESS`
- `UPDATE_CARD_SUCCESS`

** NOTE: `action` is coincidentally named. Remember that `action` is the redux action while `action.card.actions` are the card’s `Action` objects stored on the server.**

### 1.6.1. FETCH_CARD_SUCCESS

The value of `state` is returned with `action.card.actions` replacing all of the card’s actions within it. Any actions which did not exist are concatenated to `state`.

### 1.6.2. UPDATE_CARD_SUCCESS

The value of `state` is returned with `action.card.actions` replacing all of the card’s actions within it. Any actions which did not exist are concatenated to `state`.

## 1.7. ColorsReducer

This reducer reacts to the following action type:

- `TOGGLE_COLORBLIND`

The state used by this reducer is unique in that it is an object instead of an array of objects or a string. The default value is:

```json
{
  colorblind: false
}
```

### 1.7.1. TOGGLE_COLORBLIND

The returns the inverted boolean value of `state.colorblind`.
