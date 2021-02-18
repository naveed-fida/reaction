import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

import apiClient from '../lib/ApiClient';
jest.mock('../lib/ApiClient');

import * as actions from './CommentActions';
import * as types from '../constants/ActionTypes';

describe("CommentActions", () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.clearActions()
  });

  describe("CREATE_COMMENT_REQUEST", () => {
    it("returns the correct object", () => {
      expect(actions.createCommentRequest())
        .toEqual({ type: types.CREATE_COMMENT_REQUEST });
    });
  });

  describe("CREATE_COMMENT_SUCCESS", () => {
    it("returns the correct object", () => {
      expect(actions.createCommentSuccess({}))
          .toEqual({ type: types.CREATE_COMMENT_SUCCESS, comment: {} });
    });
  });

  describe("action creators", () => {
    let storeActions;

    afterEach(() => {
      storeActions = [];
    });

    describe("createComment", () => {
      const newComment = { text: "My comment" };
      const newCommentWithId = { ...newComment, id: 1 };
      const cb = jest.fn();

      beforeEach(() => {
        store.dispatch(actions.createComment(1, newComment, cb));

        const invocationArgs = apiClient.createComment.mock.calls[0];
        const callback = invocationArgs[2];

        callback(newCommentWithId);
        storeActions = store.getActions();
      });

      it("dispatches createCommentRequest()", () => {
        expect(
          storeActions[0]
        ).toEqual(actions.createCommentRequest());
      });

      it("dispatches createCommentSuccess()", () => {
        expect(
          storeActions[1]
        ).toEqual(actions.createCommentSuccess(newCommentWithId));
      });

      it("calls the callback if one is provided", () => {
        expect(cb).toHaveBeenCalledWith(newCommentWithId);
      });
    });
  });
});
