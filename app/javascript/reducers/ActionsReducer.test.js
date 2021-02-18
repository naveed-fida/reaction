import reducer from './ActionsReducer';

import * as types from '../constants/ActionTypes';

describe("ActionsReducer", () => {
  it("handles unknown action types", () => {
    expect(reducer('state', { type: "UNKNOWN TYPE" }))
      .toEqual('state');
  });

  describe("FETCH_CARD_SUCCESS", () => {
    it("replaces the owner object's data", () => {
      const state = [
        { id: 1, description: "Stuff", card_id: 1 }
      ];

      const newAction = { id: 1, description: "updated", card_id: 1 };

      expect(
        reducer(state, {
          type: types.FETCH_CARD_SUCCESS,
          card: { id: 1, actions: [newAction] }
        })
      ).toEqual([newAction]);
    });

    it("doesn't replace data not owned by the same object", () => {
      const state = [
        { id: 2, description: "Stuff", card_id: 2 }
      ];

      const newAction = { id: 1, description: "updated", card_id: 1 };

      expect(
        reducer(state, {
          type: types.FETCH_CARD_SUCCESS,
          card: { id: 1, actions: [newAction] }
        })
      ).toEqual(state.concat(newAction));
    });
  });

  describe("UPDATE_CARD_SUCCESS", () => {
    it("replaces the owner object's data", () => {
      const state = [
        { id: 1, description: "Stuff", card_id: 1 }
      ];

      const newAction = { id: 1, description: "updated", card_id: 1 };

      expect(
        reducer(state, {
          type: types.UPDATE_CARD_SUCCESS,
          card: { id: 1, actions: [newAction] }
        })
      ).toEqual([newAction]);
    });

    it("doesn't replace data not owned by the same object", () => {
      const state = [
        { id: 2, description: "Stuff", card_id: 2 }
      ];

      const newAction = { id: 1, description: "updated", card_id: 1 };

      expect(
        reducer(state, {
          type: types.UPDATE_CARD_SUCCESS,
          card: { id: 1, actions: [newAction] }
        })
      ).toEqual(state.concat(newAction));
    });
  });
});
