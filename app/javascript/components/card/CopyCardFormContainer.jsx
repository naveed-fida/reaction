import React from 'react';
import PropTypes from 'prop-types';

import CopyCardForm from './CopyCardForm';

import * as actions from '../../actions/CardActions';
import calculatePosition from '../../lib/PositionCalculator';
import * as commentSelectors from '../../selectors/CommentSelectors';
import * as cardSelectors from '../../selectors/CardSelectors';

class CopyCardFormContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static propTypes = {
    card: PropTypes.object,
    onClose: PropTypes.func
  };

  state = {
    location: {
      boardId: undefined,
      listId: undefined,
      position: undefined
    },
    title: '',
    keepComments: true
  };

  componentDidMount() {
    this.setState({ title: this.props.card.title });
  }

  handleLocationChange = (location) => {
    this.setState({ location });
  };

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleKeepCommentsChange = (e) => {
    this.setState({ keepComments: e.target.checked });
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
      actions.createCard(this.state.location.listId, {
        title: this.state.title,
        position: calculatePosition(listCards, position),
        copy_from: this.props.card.id,
        keep: {
          comments: this.state.keepComments
        }
      }, () => {
        this.props.onClose(new Event("click"));
      })
    );
  };

  isSubmitDisabled = () => {
    const { boardId, listId, position } = this.state.location;

    return boardId == null || listId == null || position == null;
  };

  comments = () => {
    const state = this.context.store.getState();

    return commentSelectors.cardComments(state, this.props.card.id);
  };

  render() {
    return (
      <CopyCardForm
        card={this.props.card}
        commentsCount={this.comments().length}
        keepComments={this.state.keepComments}
        onCloseClick={this.props.onClose}
        onLocationChange={this.handleLocationChange}
        onTitleChange={this.handleTitleChange}
        onKeepCommentsChange={this.handleKeepCommentsChange}
        onSubmit={this.handleSubmit}
        isSubmitDisabled={this.isSubmitDisabled()}
        title={this.state.title}
      />
    );
  }
}

export default CopyCardFormContainer;
