import reducer from './ListsReducer';
import * as types from '../constants/ActionTypes';

describe("ListsReducer", () => {
  describe("unknown type", () => {
    it("returns the state parameter", () => {
      expect(
        reducer("param value", { type: "FAKE_TYPE_FOR_TEST" })
      ).toEqual("param value");
    });
  });

  describe("CREATE_LIST_SUCCESS", () => {
    it("returns the current state with the `list` action value concatenated", () => {
      const list1 = { id: 1, title: "Old list", board_id: 1 };
      const list2 = { id: 2, title: "New list", board_id: 1 };

      expect(
        reducer([list1], {
          type: types.CREATE_LIST_SUCCESS,
          boardId: 1,
          list: list2,
        })
      ).toEqual([list1, list2]);
    });
  });

  describe("UPDATE_LIST_SUCCESS", () => {
    it("returns the state with the correct list updated", () => {
      const list1 = { id: 1, title: "First list", board_id: 1 };
      const list2 = { id: 2, title: "Second list", board_id: 1 };
      const list3 = { id: 3, title: "Third list", board_id: 1 };
      const updatedList = {
        ...list2,
        title: "updated list",
        position: 10
      };

      expect(
        reducer([list1, list2, list3], {
          type: types.UPDATE_LIST_SUCCESS,
          boardId: 1,
          listId: 2,
          updatedList
        })
      ).toEqual([list1, updatedList, list3]);
    });
  });

  describe("FETCH_BOARD_SUCCESS", () => {
    it("discards the 'cards' value", () => {
      const list = { id: 1, title: "My title", cards: [] };

      expect(
        reducer([], {
          type: types.FETCH_BOARD_SUCCESS,
          board: { lists: [list] }
        })
      ).toEqual([{ id: 1, title: "My title" }]);
    });

    describe("board lists already exist in the store", () => {
      it("replaces them", () => {
        const oldList = { id: 1, title: "My title" };
        const newList = { id: 1, title: "My new title" };

        expect(
          reducer([oldList], {
            type: types.FETCH_BOARD_SUCCESS,
            board: { lists: [newList] }
          })
        ).toEqual([newList]);
      });
    });

    describe("board lists are not in the store yet", () => {
      it("adds them", () => {
        const list1 = { id: 1, title: "My title" };
        const list2 = { id: 2, title: "My new title" };

        expect(
          reducer([list1], {
            type: types.FETCH_BOARD_SUCCESS,
            board: { lists: [list2] }
          })
        ).toEqual([list1, list2]);
      });
    });
  });
});
