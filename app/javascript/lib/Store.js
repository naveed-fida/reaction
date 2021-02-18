import { createStore as cs, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';

import boardsReducer from '../reducers/BoardsReducer';
import listsReducer from '../reducers/ListsReducer';
import statusReducer from '../reducers/StatusReducer';
import cardsReducer from '../reducers/CardsReducer';
import commentsReducer from '../reducers/CommentsReducer';
import actionsReducer from '../reducers/ActionsReducer';
import colorsReducer from '../reducers/ColorsReducer';

function reducer(state = {}, action) {
  return {
    boards: boardsReducer(state.boards, action),
    lists: listsReducer(state.lists, action),
    status: statusReducer(state.status, action),
    cards: cardsReducer(state.cards, action),
    comments: commentsReducer(state.comments, action),
    actions: actionsReducer(state.actions, action),
    colors: colorsReducer(state.colors, action)
  };
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export function createStore(initialState = {}) {
  return cs(reducer, initialState, composeEnhancers(applyMiddleware(ReduxThunk)));
}
