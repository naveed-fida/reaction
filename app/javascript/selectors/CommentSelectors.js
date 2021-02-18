export function cardComments(state, cardId, sortFunction) {
  const comments = state.comments.filter(comment => comment.card_id === cardId);

  if (typeof sortFunction === 'function') {
    return comments.sort(sortFunction);
  } else {
    return comments;
  }
}

export function cardCommentsAndActions(state, cardId, sortFunction) {
  const comments = cardComments(state, cardId);
  const actions = state.actions.filter(
    action => action.card_id === cardId
  ).map(
    action => ({...action, isAction: true})
  );

  if (typeof sortFunction === 'function') {
    return comments.concat(actions).sort(sortFunction);
  } else {
    return comments.concat(actions)
  }
}
