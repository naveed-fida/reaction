import reducer from './CardsReducer';

import * as types from '../constants/ActionTypes';

describe("CardsReducer", () => {
  it("handles unknown types", () => {
    expect(
      reducer('initial state', { type: 'FAKE_TYPE' })
    ).toEqual('initial state');
  });

  describe("FETCH_BOARD_SUCCESS", () => {
    const existingCard = { id: 1, board_id: 1, list_id: 1, title: "old card" };
    const replacementCard = { id: 1, board_id: 1, list_id: 1, title: "replacement card" };
    const newCard1 = { id: 2, board_id: 1, list_id: 1, title: "new card" };
    const newCard2 = { id: 3, board_id: 1, list_id: 2, title: "new card" };
    const otherCard = { id: 4, board_id: 2, title: "other card" };

    it("adds new cards to the state", () => {
      expect(
        reducer([existingCard], {
          type: types.FETCH_BOARD_SUCCESS,
          board: {
            id: 1,
            lists: [{
              id: 1,
              cards: [existingCard, newCard1]
            }, {
              id: 2,
              cards: [newCard2]
            }]
          }
        })
      ).toEqual([existingCard, newCard1, newCard2])
    });

    it("updates existing cards from the board", () => {
      expect(
        reducer([existingCard], {
          type: types.FETCH_BOARD_SUCCESS,
          board: {
            id: 1,
            lists: [{
              id: 1,
              cards: [{ id: 1, list_id: 27, board_id: 1 }]
            }]
          }
        })
      ).toEqual([{ ...existingCard, list_id: 27 }]);
    });

    it("removes cards that no longer exist in the board", () => {
      expect(
        reducer([existingCard], {
          type: types.FETCH_BOARD_SUCCESS,
          board: {
            id: 1,
            lists: [{
              id: 1,
              cards: []
            }]
          }
        })
      ).toEqual([]);
    });

    it("doesn't change other board cards", () => {
      expect(
        reducer([otherCard], {
          type: types.FETCH_BOARD_SUCCESS,
          board: {
            id: 1,
            lists: [{
              id: 1,
              cards: [newCard1]
            }]
          }
        })
      ).toEqual([otherCard, newCard1]);
    });
  });

  describe("CREATE_CARD_SUCCESS", () => {
    it("returns the state with the new card added", () => {
      const newCard = { id: 1 };

      expect(
        reducer(['other stuff'], {
          type: types.CREATE_CARD_SUCCESS,
          card: newCard
        })
      ).toEqual(['other stuff', newCard]);
    });
  });

  describe("FETCH_CARD_SUCCESS", () => {
    const card = { id: 1 };

    describe("the card already exists", () => {
      it("is replaced", () => {
        expect (
          reducer([{ id: 1, title: "old card" }], {
            type: types.FETCH_CARD_SUCCESS,
            card
          })
        ).toEqual([card]);
      });
    });

    describe("the card doesn't exist", () => {
      it("is added", () => {
        expect (
          reducer([], {
            type: types.FETCH_CARD_SUCCESS,
            card
          })
        ).toEqual([card]);
      });
    });
  });

  describe("UPDATE_CARD_SUCCESS", () => {
    const card = { id: 1, title: "My title" };
    const updatedCard = { id: 1, title: "New title" };

    describe("the card exists", () => {
      it("is updated", () => {
        expect(
          reducer([card], {
            type: types.UPDATE_CARD_SUCCESS,
            card: updatedCard
          })
        ).toEqual([updatedCard]);
      });
    });

    describe("the card does not exist", () => {
      it("is not added", () => {
        expect(
          reducer([], {
            type: types.UPDATE_CARD_SUCCESS,
            card: updatedCard
          })
        ).toEqual([]);
      });
    });
  });

  describe("CREATE_COMMENT_SUCCESS", () => {
    it("adds one to the card comments_count", () => {
      expect(
        reducer([{ id: 1, comments_count: 1 }], {
          type: types.CREATE_COMMENT_SUCCESS,
          comment: { card_id: 1 }
        })
      ).toEqual([{ id: 1, comments_count: 2 }]);
    });
  });
});
