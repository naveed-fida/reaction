import reducer from './CommentsReducer';

import * as types from '../constants/ActionTypes';

describe("CommentsReducer", () => {
  it("returns the state for unknown types", () => {
    expect(
      reducer('state', { type: "UNKNOWN TYPE" })
    ).toEqual('state');
  });

  describe("FETCH_CARD_SUCCESS", () => {
    const comments = [
      { id: 1, text: "First comment", card_id: 1 },
      { id: 2, text: "Second comment", card_id: 1 },
      { id: 3, text: "Third comment", card_id: 3 }
    ];
    const updatedComment = { id: 1, text: "Updated comment", card_id: 1 };

    it("replaces card comments", () => {
      expect(
        reducer([comments[0], comments[1]], {
          type: types.FETCH_CARD_SUCCESS,
          card: {
            id: 1,
            comments: [updatedComment]
          }
        })
      ).toEqual([updatedComment]);
    });

    it("doesn't replace other card comments", () => {
      expect(
        reducer([comments[2]], {
          type: types.FETCH_CARD_SUCCESS,
          card: {
            id: 1,
            comments: [updatedComment]
          }
        })
      ).toEqual([comments[2], updatedComment]);
    });
  });

  describe("CREATE_COMMENT_SUCCESS", () => {
    it("returns the state with the new comment added", () => {
      const newComment = { id: 1 };

      expect(
        reducer(['other stuff'], {
          type: types.CREATE_COMMENT_SUCCESS,
          comment: newComment
        })
      ).toEqual(['other stuff', newComment]);
    });
  });
});
