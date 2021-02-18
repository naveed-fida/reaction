import * as cardSelectors from './CardSelectors';
import * as listSelectors from './ListSelectors';

export function getBoardById(state, id) {
  return state.boards.find(board => board.id === id);
}
