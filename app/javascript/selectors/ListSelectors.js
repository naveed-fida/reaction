export function boardListsSelector(state, boardId) {
  const lists = state.lists;
  return lists.filter(list => list.board_id === boardId);
}

export function getListById(state, id) {
  const lists = state.lists;
  return lists.find(list => list.id === id);
}
