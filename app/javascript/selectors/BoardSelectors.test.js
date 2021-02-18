import * as selectors from './BoardSelectors';

describe("BoardSelectors", () => {
  describe("getBoardById", () => {
    const board = { id: 1, title: "My board" };
    const state = {
      boards: [board]
    };

    describe("valid card id", () => {
      it("returns the correct board", () => {
        expect(
          selectors.getBoardById(state, 1)
        ).toEqual(board);
      });
    });

    describe("invalid card id", () => {
      it("returns the undefined", () => {
        expect(
          selectors.getBoardById(state, 2)
        ).toEqual(undefined);
      });
    });
  });
});
