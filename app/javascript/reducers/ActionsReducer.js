export default function actionsReducer(state = [], action) {
  if (action.type === 'FETCH_CARD_SUCCESS') {
    const actions = action.card.actions;
    const filteredActions = state.filter(
      a => a.card_id !== action.card.id
    );

    return filteredActions.concat(actions);
  } else if (action.type === 'UPDATE_CARD_SUCCESS') {
    const actions = action.card.actions;
    const filteredActions = state.filter(
      a => a.card_id !== action.card.id
    );

    return filteredActions.concat(actions);
  }
  return state;
}
