import reducer from './BoardsReducer';
import * as types from '../constants/ActionTypes';

describe("BoardsReducer", () => {
  describe("unknown type", () => {
    it("returns the state parameter", () => {
      expect(
        reducer("param value", { type: "FAKE_TYPE_FOR_TEST" })
      ).toEqual("param value");
    });
  });

  describe("FETCH_BOARDS_SUCCESS", () => {
    it("returns the action.boards value", () => {
      expect(
        reducer([], {
          type: types.FETCH_BOARDS_SUCCESS,
          boards: [
            { id: 1, title: "My board" },
            { id: 2, title: "My other board" }
          ]
        })
      ).toEqual([
        { id: 1, title: "My board" },
        { id: 2, title: "My other board" }
      ]);
    });
  });

  describe("CREATE_BOARD_SUCCESS", () => {
    it("returns the current state with the `board` action value concatenated", () => {
      const board1 = { id: 1, title: "Old board", };
      const board2 = { id: 2, title: "New board", };

      expect(
        reducer([board1], {
          type: types.CREATE_BOARD_SUCCESS,
          board: board2,
        })
      ).toEqual([board1, board2]);
    });
  });

  describe("FETCH_BOARD_SUCCESS", () => {
    it("does discards the 'lists' value", () => {
      const newBoard = { id: 1, title: "My title", lists: [] };

      expect(
        reducer([], {
          type: types.FETCH_BOARD_SUCCESS,
          board: newBoard
        })
      ).toEqual([{ id: 1, title: "My title" }]);
    });

    describe("board already exists in the store", () => {
      it("replaces the board", () => {
        const oldBoard = { id: 1, title: "My title" };
        const newBoard = { id: 1, title: "My new title" };

        expect(
          reducer([oldBoard], {
            type: types.FETCH_BOARD_SUCCESS,
            board: newBoard
          })
        ).toEqual([newBoard]);
      });
    });

    describe("board does not exist in state", () => {
      it("adds the board to the store", () => {
        const board1 = { id: 1, title: "My title" };
        const newBoard = { id: 2, title: "My new title" };

        expect(
          reducer([board1], {
            type: types.FETCH_BOARD_SUCCESS,
            board: newBoard
          })
        ).toEqual([board1, newBoard]);
      });
    });
  });
});
