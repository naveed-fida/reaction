import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import * as actions from '../../actions/BoardActions';
import * as boardSelectors from '../../selectors/BoardSelectors';
import * as cardSelectors from '../../selectors/CardSelectors';

import * as statuses from '../../constants/Statuses';

import Board from './Board';

class BoardContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    currentBoardId: PropTypes.number
  };

  static propTypes = {
    match: PropTypes.object
  };

  getChildContext() {
    return {
      currentBoardId: this.boardId()
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      board: null,
      isFetching: false
    };
  }

  componentDidMount() {
    const store = this.context.store;
    this.unsubscribe = store.subscribe(() => this.updateBoardInState());
    
    // We need to set the board during the initial render.
    this.updateBoardInState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  boardId = () => {
    const { id } = this.props.match.params;
    const { url } = this.props.match;

    if (url.match(new RegExp("^/boards/"))) {
      return Number(id);
    } else {
      const store = this.context.store;
      const card = cardSelectors.getCardById(
        store.getState(),
        Number(id)
      );

      if (card) {
        return card.board_id;
      } else {
        return null;
      }
    }
  };

  updateBoardInState = () => {
    const store = this.context.store;
    const boardId = this.boardId();

    if (!boardId) { return null; }

    if (!this.state.board && !this.state.isFetching) {
      this.fetchBoard(boardId);
    }
  }

  fetchBoard = (id) => {
    const store = this.context.store;
    this.setState({
      isFetching: true,
    }, () => {
      store.dispatch(actions.fetchBoard(id, this.doneFetchingBoard));
    });
  }

  doneFetchingBoard = (board) => {
    this.setState({
      isFetching: false,
      board
    });
  };

  render() {
    return (
      <Board board={this.state.board} />
    );
  }
};

export default BoardContainer;
