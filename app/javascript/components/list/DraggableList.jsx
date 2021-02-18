import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/ListActions';
import * as listSelectors from '../../selectors/ListSelectors';
import * as cardSelectors from '../../selectors/CardSelectors';
import calculatePosition from '../../lib/PositionCalculator';

import List from './List';

function mapStateToProps(state, ownProps) {
  return {
    list: ownProps.list,
    onAddCardClick: ownProps.onAddCardClick,
    addCardActive: ownProps.addCardActive,
    onNewCardFormChange: ownProps.onNewCardFormChange,
    onNewCardFormClose: ownProps.onNewCardFormClose,
    onNewCardFormSubmit: ownProps.onNewCardFormSubmit,
    onNewCardFormKeyPress: ownProps.onNewCardFormKeyPress,
    newCardFormText: ownProps.newCardFormText,
    cards: cardSelectors.listCards(state, ownProps.list.id),
    state
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    onDrop: function handleDrop(e) {
      const droppedEl = e.target;
      const listId = Number(droppedEl.dataset.listId);
      const siblings = Array.prototype.slice.call(droppedEl.parentNode.childNodes);
      const lists = listSelectors.boardListsSelector(stateProps.state, ownProps.list.board_id);
      const targetIndex = siblings.indexOf(droppedEl);
      const sortedStartingList = lists
        .slice()
        .sort((a, b) => a.position - b.position)
      const droppedList = sortedStartingList
          .find(list => list.id === listId);
      const sourceIndex = sortedStartingList.indexOf(droppedList);
      const newPosition = calculatePosition(lists, targetIndex, sourceIndex);

      dispatchProps.dispatch(
        actions.updateList(
          ownProps.list.id,
          { position: newPosition }
        )
      );
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(List);
