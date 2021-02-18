import * as selectors from './CommentSelectors';

describe("cardComments", () => {
  it("returns cards from the correct card", () => {
    const state = { comments: [
      { id: 1, text: "A", card_id: 1 },
      { id: 2, text: "B", card_id: 2 },
      { id: 3, text: "C", card_id: 1 }
    ], actions: []};

    expect(selectors.cardComments(state, 1))
     .toEqual([state.comments[0], state.comments[2]]);
  });

  it("sorts the comments if a sort function is provided", () => {
    const state = { comments: [
      { id: 1, text: "A", card_id: 1 },
      { id: 3, text: "B", card_id: 1 },
      { id: 2, text: "C", card_id: 1 }
    ], actions: []};

    expect(selectors.cardComments(state, 1, (a, b) => a.id - b.id))
     .toEqual([state.comments[0], state.comments[2], state.comments[1]]);
  });
});

describe("cardCommentsAndActions", () => {
  it("returns cards from the correct card", () => {
    const state = { comments: [
      { id: 1, text: "A", card_id: 1 },
      { id: 2, text: "B", card_id: 2 },
      { id: 3, text: "C", card_id: 1 }
    ], actions: []};

    expect(selectors.cardCommentsAndActions(state, 1))
     .toEqual([state.comments[0], state.comments[2]]);
  });

  it("sorts the comments if a sort function is provided", () => {
    const state = { comments: [
      { id: 1, text: "A", card_id: 1 },
      { id: 3, text: "B", card_id: 1 },
      { id: 2, text: "C", card_id: 1 }
    ], actions: []};

    expect(selectors.cardCommentsAndActions(state, 1, (a, b) => a.id - b.id))
     .toEqual([state.comments[0], state.comments[2], state.comments[1]]);
  });

  it("combines comments and actions and marks actions", () => {
    const state = { comments: [
      { id: 1, text: "A", card_id: 1 },
      { id: 3, text: "B", card_id: 1 }
    ], actions: [
      { id: 2, text: "C", card_id: 1 }
    ]};

    expect(selectors.cardCommentsAndActions(state, 1, (a, b) => a.id - b.id))
     .toEqual([state.comments[0], {...state.actions[0], isAction: true}, state.comments[1]]);
  });
});
