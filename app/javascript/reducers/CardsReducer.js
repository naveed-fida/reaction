export default function cardsReducer(state = [], action) {
  if (action.type === 'FETCH_BOARD_SUCCESS') {
    const stateCopy = state.slice();
    const lists = action.board.lists;
    const boardId = action.board.id;
    let cards = [];

    lists.forEach(list => cards = cards.concat(list.cards));

    const filteredState = state.filter(card => card.board_id !== boardId);

    cards = cards.map((card) => {
      const existingVersion = state.find(stateCard => card.id === stateCard.id);

      if (existingVersion) {
        return { ...existingVersion, ...card };
      } else {
        return card;
      }
    });

    return filteredState.concat(cards);
  } else if (action.type === 'CREATE_CARD_SUCCESS') {
    return state.concat(action.card);
  } else if (action.type === 'FETCH_CARD_SUCCESS') {
    const excludedCards = state.filter(card => card.id !== action.card.id);
    return excludedCards.concat(action.card);
  } else if (action.type === 'UPDATE_CARD_SUCCESS') {
    return state.map(card => {
      if (card.id === action.card.id) return action.card;
      else return card;
    });
  } else if (action.type === 'CREATE_COMMENT_SUCCESS') {
    return state.map(card => {
      if (card.id === action.comment.card_id) {
        return { ...card, comments_count: card.comments_count + 1 };
      } else {
        return card;
      }
    });
  } else {
    return state;
  }
};
