import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

import apiClient from '../lib/ApiClient';
jest.mock('../lib/ApiClient');

import * as actions from '../actions/CardActions';
import * as types from '../constants/ActionTypes';

describe("CardActions", () => {
  let store;

  beforeEach(() => {
    store = mockStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
    store.clearActions()
  });

  describe("createCardRequest", () => {
    it("returns the correct object", () => {
      expect(
        actions.createCardRequest()
      ).toEqual({ type: types.CREATE_CARD_REQUEST });
    });
  });

  describe("createCardSuccess", () => {
    it("returns the correct object", () => {
      expect(
        actions.createCardSuccess({ id: 1 })
      ).toEqual({ type: types.CREATE_CARD_SUCCESS, card: { id: 1 } });
    });
  });

  describe("fetchCardRequest", () => {
    it("returns the correct object", () => {
      expect(
        actions.fetchCardRequest()
      ).toEqual({ type: types.FETCH_CARD_REQUEST });
    });
  });

  describe("fetchCardSuccess", () => {
    it("returns the correct object", () => {
      expect(
        actions.fetchCardSuccess({ id: 1 })
      ).toEqual({ type: types.FETCH_CARD_SUCCESS, card: { id: 1 }});
    });
  });

  describe("updateCardRequest", () => {
    it("returns the correct object", () => {
      expect(
        actions.updateCardRequest()
      ).toEqual({ type: types.UPDATE_CARD_REQUEST });
    });
  });

  describe("updateCardSuccess", () => {
    it("returns the correct object", () => {
      const card = { id: 1, title: "Card title" };

      expect(
        actions.updateCardSuccess(card)
      ).toEqual({ type: types.UPDATE_CARD_SUCCESS, card });
    });
  });

  describe("action creators", () => {
    let storeActions;

    afterEach(() => {
      storeActions = [];
    });

    describe("createCard", () => {
      const newCard = { title: "My card" };
      const newCardWithId = { id: 1, title: "My card" }
      const cb = jest.fn();

      beforeEach(() => {
        store.dispatch(actions.createCard(1, newCard, cb));

        const invocationArgs = apiClient.createCard.mock.calls[0];
        const callback = invocationArgs[2];

        callback(newCardWithId);
        storeActions = store.getActions();
      });

      afterEach(() => {
        cb.mockClear();
      });

      it("dispatches createCardRequest", () => {
        expect(
          storeActions[0]
        ).toEqual(actions.createCardRequest());
      });

      it("dispatches createCardSuccess with the new card", () => {
        expect(
          storeActions[1]
        ).toEqual(actions.createCardSuccess(newCardWithId));
      });

      it("calls the callback if one is provided", () => {
        expect(cb).toHaveBeenCalledWith(newCardWithId);
      });
    });

    describe("fetchCard", () => {
      const card = { id: 1, title: "My card" };
      const cb = jest.fn();

      beforeEach(() => {
        store.dispatch(actions.fetchCard(1, cb));

        const invocationArgs = apiClient.getCard.mock.calls[0];
        const callback = invocationArgs[1];

        callback(card);
        storeActions = store.getActions();
      });

      afterEach(() => {
        cb.mockClear();
      });

      it("dispatches fetchCardRequest", () => {
        expect(
          storeActions[0]
        ).toEqual(actions.fetchCardRequest());
      });

      it("dispatches fetchCardSuccess with the card", () => {
        expect(
          storeActions[1]
        ).toEqual(actions.fetchCardSuccess(card))
      });

      it("calls the callback if one is provided", () => {
        expect(cb).toHaveBeenCalledWith(card);
      });
    });

    describe("updateCard", () => {
      const card = { id: 1, title: "My title" };
      const updatedCard = { id: 1, title: "New title" };
      const cb = jest.fn();

      beforeEach(() => {
        store.dispatch(actions.updateCard(1, updatedCard, cb));

        const invocationArgs = apiClient.updateCard.mock.calls[0];
        const callback = invocationArgs[2];

        callback(updatedCard);
        storeActions = store.getActions();
      });

      it("dispatches updateCardRequest()", () => {
        expect(
          storeActions[0]
        ).toEqual(actions.updateCardRequest());
      });

      it("dispatches updateCardSuccess()", () => {
        expect(
          storeActions[1]
        ).toEqual(actions.updateCardSuccess(updatedCard));
      });

      it("calls the callback if one is provided", () => {
        expect(cb).toHaveBeenCalledWith(updatedCard);
      });
    });
  });
});
