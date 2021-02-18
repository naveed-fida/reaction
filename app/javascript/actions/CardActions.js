import apiClient from '../lib/ApiClient';
import * as types from '../constants/ActionTypes';

export function createCardRequest() {
  return { type: types.CREATE_CARD_REQUEST };
}

export function createCardSuccess(newCard) {
  return { type: types.CREATE_CARD_SUCCESS, card: newCard };
}

export function fetchCardRequest() {
  return { type: types.FETCH_CARD_REQUEST };
}

export function fetchCardSuccess(card) {
  return { type: types.FETCH_CARD_SUCCESS, card };
}

export function updateCardRequest() {
  return { type: types.UPDATE_CARD_REQUEST };
}

export function updateCardSuccess(updatedCard) {
  return { type: types.UPDATE_CARD_SUCCESS, card: updatedCard };
}

export function createCard(listId, card, callback) {
  return function(dispatch) {
    dispatch(createCardRequest());
    apiClient.createCard(listId, card, (newCard) => {
      dispatch(createCardSuccess(newCard));
      if (callback) { callback(newCard) };
    });
  }
}

export function fetchCard(cardId, callback) {
  return function(dispatch) {
    dispatch(fetchCardRequest());
    apiClient.getCard(cardId, (card) => {
      dispatch(fetchCardSuccess(card));
      if (callback) { callback(card) };
    });
  };
}

export function updateCard(cardId, attrs, callback) {
  return function(dispatch) {
    dispatch(updateCardRequest());
    apiClient.updateCard(cardId, attrs, (updatedCard) => {
      dispatch(updateCardSuccess(updatedCard));
      if (callback) callback(updatedCard);
    });
  }
}
