function listsReducer(state = [], action) {
  if (action.type === 'CREATE_LIST_SUCCESS') {
    return state.concat(action.list);
  } else if (action.type === 'UPDATE_LIST_SUCCESS') {
    const { listId, updatedList } = action;

    return state.map(list => {
      if (list.id === listId) {
        return updatedList;
      } else {
        return list;
      }
    });
  } else if (action.type === 'FETCH_BOARD_SUCCESS') {
    const newLists = action.board.lists.map(list => {
      const { cards, ...listWithoutCards } = list;

      return listWithoutCards
    });
    const newListIds = newLists.map(list => list.id);
    let excludedLists = state.filter(
      list => newListIds.indexOf(list.id) === -1
    );

    return excludedLists.concat(newLists);
  } else {
    return state;
  }
}

export default listsReducer;
