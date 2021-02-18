import React from 'react';
import PropTypes from 'prop-types';

import CardLocationForm from './CardLocationForm';

import * as listSelectors from '../../selectors/ListSelectors';
import * as cardSelectors from '../../selectors/CardSelectors';
import calculatePosition from '../../lib/PositionCalculator';
import { fetchBoards, fetchBoard } from '../../actions/BoardActions';

const sortByTitle = (a, b) => {
  const aTitle = a.title.toLowerCase();
  const bTitle = b.title.toLowerCase();

  if (aTitle < bTitle) return -1;
  if (aTitle > bTitle) return 1;
  return 0;
};

class CardLocationFormContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static propTypes = {
    card: PropTypes.object,
    mode: PropTypes.string,
    onLocationChange: PropTypes.func
  };

  state = {
    selectedBoard: undefined,
    selectedList: undefined,
    selectedPosition: undefined,
    boards: [],
    lists: [],
    positions: []
  };

  componentDidMount() {
    const store = this.context.store;
    const state = store.getState();
    const card = this.props.card;
    const boards = state.boards.sort(sortByTitle);
    const lists = listSelectors
      .boardListsSelector(state, this.props.card.board_id)
      .sort(sortByTitle);

    this.setState({
      selectedBoard: boards.find(board => board.id === card.board_id),
      selectedPosition: this.currentCardPositionIndex(),
      boards,
      lists
    }, () => {
      this.selectList(this.props.card.list_id);
    });

    this.unsubscribe = store.subscribe(() => {
      this.setState({ boards: store.getState().boards.slice().sort(sortByTitle) });
    });

    store.dispatch(fetchBoards());
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleBoardChange = (e) => {
    const selectedValue = Number(e.target.value);

    this.selectBoard(selectedValue);
  };

  handleListChange = (e) => {
    const selectedValue = Number(e.target.value);

    this.selectList(selectedValue)
  };

  handlePositionChange = (e) => {
    const selectedValue = Number(e.target.value);

    this.selectPosition(selectedValue)
  };

  currentCardPositionIndex = () => {
    const store = this.context.store;
    const state = store.getState();
    const card = this.props.card;
    const cards = cardSelectors
      .listCards(state, this.props.card.list_id)
      .sort((a, b) => a.position - b.position);
    let currentPosition = cards.findIndex(card => card.id === this.props.card.id);
    if (currentPosition === -1) currentPosition = undefined;

    return currentPosition;
  };

  selectBoard = (id) => {
    const store = this.context.store;

    store.dispatch(fetchBoard(id, (board) => {
      const state = store.getState();
      const newLists = listSelectors
        .boardListsSelector(state, id)
        .sort(sortByTitle);

      this.setState({
        selectedBoard: board,
        lists: newLists
      }, () => {
        if (this.state.selectedBoard.id === this.props.card.board_id) {
          this.selectList(this.props.card.list_id);
        } else if (newLists.length) {
          this.selectList(newLists[0].id);
        } else {
          this.selectList();
        }
      });
    }));
  }

  selectList = (id) => {
    let list;
    const positions = [];

    if (id) {
      list = this.state.lists.find(list => list.id === id);
    } else {
      list = this.state.lists[0];
    }

    if (list) {
      const store = this.context.store;
      const state = store.getState();
      const cards = cardSelectors
        .listCards(state, list.id)
        .sort((a, b) => a.position - b.position);
      let currentPosition = cards.findIndex(card => card.id === this.props.card.id);
      if (currentPosition === -1) currentPosition = undefined;

      if (currentPosition == undefined || this.props.mode === 'copy') {
        var potentialPositionsLength = cards.length + 1;
      } else {
        var potentialPositionsLength = cards.length;
      }

      for (let i = 0; i < potentialPositionsLength; i ++) {
        positions.push(i);
      }
    }    

    this.setState({
      selectedList: list,
      positions
    }, () => {
      if (
        this.state.selectedBoard.id === this.props.card.board_id &&
        this.state.selectedList.id === this.props.card.list_id &&
        this.props.mode !== 'copy'
      ) {
        this.selectPosition(this.currentCardPositionIndex());
      } else {
        this.selectPosition("bottom");
      }
    });
  }

  selectPosition = (position) => {
    if (position === "bottom") {
      position = this.state.positions[this.state.positions.length - 1];
    }

    if (position != null) {
      this.setState({
        selectedPosition: position
      }, () => {
        this.props.onLocationChange({
          boardId: this.state.selectedBoard && this.state.selectedBoard.id,
          listId: this.state.selectedList && this.state.selectedList.id,
          position: this.state.selectedPosition
        });
      });
    } else {
      this.setState({
        selectedPosition: this.state.positions[0]
      }, () => {
        this.props.onLocationChange({
          boardId: this.state.selectedBoard && this.state.selectedBoard.id,
          listId: this.state.selectedList && this.state.selectedList.id,
          position: this.state.selectedPosition
        });
      });
    }
  }

  selectedBoardTitle = () => {
    if (this.state.selectedBoard) {
      return this.state.selectedBoard.title;
    } else {
      return "No Boards";
    }
  }

  selectedBoardId = () => {
    if (this.state.selectedBoard) {
      return this.state.selectedBoard.id;
    } else {
      return undefined;
    }
  }

  selectedListTitle = () => {
    if (this.state.selectedList) {
      return this.state.selectedList.title;
    } else {
      return "No Lists";
    }
  }

  selectedListId = () => {
    if (this.state.selectedList) {
      return this.state.selectedList.id;
    } else {
      return undefined;
    }
  }

  selectedPositionHumanIndex = () => {
    if (this.state.selectedPosition == null) {
      return "N/A"
     } else {
      return this.state.selectedPosition + 1;
     }
  }

  isSubmitDisabled = () => {
    return (
      this.state.selectedBoard == null ||
      this.state.selectedList == null ||
      this.state.selectedPosition == null 
    );
  }

  render() {
    return (
      <CardLocationForm
        boards={this.state.boards}
        lists={this.state.lists}
        positions={this.state.positions}
        selectedBoardId={this.selectedBoardId()}
        selectedBoardTitle={this.selectedBoardTitle()}
        selectedListId={this.selectedListId()}
        selectedListTitle={this.selectedListTitle()}
        selectedPosition={this.state.selectedPosition}
        currentBoardId={this.props.card.board_id}
        currentListId={this.props.card.list_id}
        currentPosition={this.currentCardPositionIndex()}
        selectedPositionHumanIndex={this.selectedPositionHumanIndex()}
        onBoardChange={this.handleBoardChange}
        onListChange={this.handleListChange}
        onPositionChange={this.handlePositionChange}
        isSubmitDisabled={this.isSubmitDisabled()}
      />
    );
  }
}

export default CardLocationFormContainer;
