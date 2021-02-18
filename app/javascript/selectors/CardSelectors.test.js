import * as selectors from './CardSelectors';

describe("CardSelectors", () => {
  describe("getCardById", () => {
    const state = { cards: [
      { id: 1, title: "My card" },
      { id: 2, title: "My card" },
      { id: 3, title: "My card" }
    ]};

    describe("valid id", () => {
      it("returns the card with the correct id", () => {
        expect(
          selectors.getCardById(state, 2)
        ).toEqual(state.cards[1]);
      });
    });

    describe("invalid id", () => {
      it("returns undefined", () => {
        expect(
          selectors.getCardById(state, 2)
        ).toEqual(state.cards[1]);
      });
    });
  });

  describe("listCards", () => {
    let state;

    beforeEach(() => {
      state = { cards: [
        { id: 1, list_id: 1,title: "My card"},
        { id: 2, list_id: 2, title: "My card"},
        { id: 3, list_id: 2, title: "My card"},
        { id: 4, list_id: 3, title: "My card"},
      ]};
    });

    it("doesn't include archived cards", () => {
      state.cards[1].archived = true;

      expect(
        selectors.listCards(state, 2)
      ).toEqual([state.cards[2]]);
    });

    describe("matches exist", () => {
      it("returns them", () => {
        expect(
          selectors.listCards(state, 2)
        ).toEqual([state.cards[1], state.cards[2]]);
      });
    });

    describe("no matches exist", () => {
      it("returns an empty array", () => {
        expect(
          selectors.listCards(state, 4)
        ).toEqual([]);
      });
    });

    it("sorts the cards if a sort function is provided", () => {
      const state = { cards: [
        { id: 1, title: "A", list_id: 1 },
        { id: 3, title: "B", list_id: 1 },
        { id: 2, title: "C", list_id: 1 }
      ], actions: []};

      expect(selectors.listCards(state, 1, (a, b) => a.id - b.id))
       .toEqual([state.cards[0], state.cards[2], state.cards[1]]);
    });
  });
});
