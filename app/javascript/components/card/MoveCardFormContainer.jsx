import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import MoveCardForm from './MoveCardForm';

import * as actions from '../../actions/CardActions';
import calculatePosition from '../../lib/PositionCalculator';
import * as cardSelectors from '../../selectors/CardSelectors';

class MoveCardFormContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static propTypes = {
    card: PropTypes.object,
    history: PropTypes.object,
    onClose: PropTypes.func
  }

  state = {
    location: {
      boardId: undefined,
      listId: undefined,
      position: undefined
    }
  };

  handleLocationChange = (location) => {
    this.setState({ location });
  };

  handleSubmit = (e) => {
    if (this.isSubmitDisabled()) { return; }

    e.preventDefault;

    const store = this.context.store;
    const state = store.getState();
    const { boardId, listId, position } = this.state.location;
    const sourceBoardId = this.props.card.board_id;
    const changingBoard = boardId !== sourceBoardId;
    const listCards = cardSelectors.listCards(
      state, listId, (a, b) => a.position - b.position
    );
    const currentIndex = listCards.findIndex(card => card.id === this.props.card.id);

    store.dispatch(
      actions.updateCard(
        this.props.card.id, {
          list_id: listId,
          position: calculatePosition(listCards, position, currentIndex)
        }, () => {
          if (changingBoard) {
            this.props.history.push(`/boards/${sourceBoardId}`);
          } else {
            this.props.onClose(new Event("click"));
          }
        }
      )
    )
  };

  isSubmitDisabled = () => {
    const { boardId, listId, position } = this.state.location;

    return boardId == null || listId == null || position == null;
  };

  render() {
    return (
      <MoveCardForm
        card={this.props.card}
        onCloseClick={this.props.onClose}
        onLocationChange={this.handleLocationChange}
        onSubmit={this.handleSubmit}
        isSubmitDisabled={this.isSubmitDisabled()}
      />
    );
  }
}

export default withRouter(MoveCardFormContainer);
