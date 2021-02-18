import apiClient from '../lib/ApiClient';
import * as types from '../constants/ActionTypes';

export function createCommentRequest() {
  return { type: types.CREATE_COMMENT_REQUEST };
}

export function createCommentSuccess(newComment) {
  return { type: types.CREATE_COMMENT_SUCCESS, comment: newComment };
}

export function createComment(cardId, attrs, callback) {
  return function(dispatch) {
    dispatch(createCommentRequest());
    apiClient.createComment(cardId, attrs, (newComment) => {
      dispatch(createCommentSuccess(newComment));

      if (callback) { callback(newComment); }
    });
  };
}
