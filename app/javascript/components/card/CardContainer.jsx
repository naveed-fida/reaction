import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';

import * as cardSelectors from '../../selectors/CardSelectors';
import * as boardSelectors from '../../selectors/BoardSelectors';
import * as commentSelectors from '../../selectors/CommentSelectors';
import * as cardActions from '../../actions/CardActions';
import * as colorActions from '../../actions/ColorActions';

import Card from './Card';
import Popover from '../shared/Popover';
import DueDateForm from './DueDateForm';
import LabelsForm from './LabelsForm';
import MoveCardFormContainer from './MoveCardFormContainer';
import CopyCardFormContainer from './CopyCardFormContainer';

class CardContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  state = {
    title: '',
    card: undefined,
    popover: {
      visible: false,
      attachedTo: null,
      type: null
    }
  };

  componentDidMount() {
    const store = this.context.store;
    this.unsubscribe = store.subscribe(() => {
      this.updateCardInState();
      this.forceUpdate();
    });
    store.dispatch(cardActions.fetchCard(this.getCardId()));
  };

  componentWillUnmount() {
    this.unsubscribe();
  };

  updateCardInState = () => {
    const store = this.context.store;
    const card = cardSelectors.getCardById(store.getState(), this.getCardId());

    if (card && this.cardOriginallyRenderedFromBoardId == null) {
      this.cardOriginallyRenderedFromBoardId = card.board_id;
    }

    if (!_.isEqual(card, this.state.card)) {
      this.setState({
        card: card,
        title: card.title
      });
    }
  };

  getCardId = () => {
    const cardId = Number(this.props.match.params.cardId);
    return cardId;
  }

  handleTitleChange = (e) => {
    e.preventDefault();

    this.setState({
      title: e.target.value
    });
  };

  handleOverlayClick = (e) => {
    if (e.target.classList.contains('screen')) {
      e.preventDefault();
      e.stopPropagation();

      if (this.state.popover.visible) {
        this.closePopover();
      } else if (this.state.card) {
        this.props.history.push(`/boards/${this.state.card.board_id}`);
      }
    }
  };

  handleCardClick = (e) => {
    if (this.state.popover.visible) {
      this.closePopover();
    }
  };

  handleTitleBlur = (e) => {
    const store = this.context.store;

    store.dispatch(cardActions.updateCard(
      this.state.card.id,
      { title: this.state.title }
    ));
  };

  handleTitleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  toggleArchive = (archived) => {
    const store = this.context.store;

    store.dispatch(cardActions.updateCard(
      this.state.card.id,
      { archived }
    ));
  };

  handleArchiveClick = (e) => {
    this.toggleArchive(true);
  };

  handleUnarchiveClick = (e) => {
    this.toggleArchive(false);
  };

  gatherComments = (e) => {
    const store = this.context.store;

    return commentSelectors.cardCommentsAndActions(store.getState(), this.state.card.id, (a, b) => (
      new Date(b.created_at) - new Date(a.created_at)
    ));
  }

  handleShowPopover = (e, type) => {
    e.stopPropagation();

    this.setState({
      popover: {
        type,
        attachedTo: e.target,
        visible: true
      }
    });
  };

  handleClosePopover = (e) => {
    e.preventDefault();
    this.closePopover();
  }

  handleDueDateSubmit = (e) => {
    e.preventDefault();

    const date = e.target.querySelector('.datepicker-select-date input').value;
    const time = e.target.querySelector('.datepicker-select-time input').value;
    const dateTime = `${date} ${time}`;

    const store = this.context.store;

    store.dispatch(cardActions.updateCard(this.state.card.id, {
      due_date: moment(dateTime, 'M/D/YYYY h:mm A').toISOString()
    }, () => {
      this.closePopover();
    }));
  }

  handleDueDateRemove = (e) => {
    e.preventDefault();

    const store = this.context.store;

    store.dispatch(cardActions.updateCard(this.state.card.id, {
      due_date: null,
      completed: false
    }, () => {
      this.closePopover();
    }));
  };

  handleToggleCompleted = (e) => {
    e.stopPropagation();

    const store = this.context.store;

    store.dispatch(cardActions.updateCard(this.state.card.id, {
      completed: !this.state.card.completed
    }));
  }

  handleToggleLabel = (e, label) => {
    const store = this.context.store;
    const currentLabels = this.state.card.labels;
    let labels;

    if (currentLabels.indexOf(label) === -1) {
      labels = currentLabels.concat(label);
    } else {
      labels = _.without(currentLabels, label);
    }

    store.dispatch(cardActions.updateCard(this.state.card.id, { labels }));
  }

  handleToggleColorblind = (e) => {
    const store = this.context.store;
    store.dispatch(colorActions.toggleColorblind());
  }

  closePopover = () => {
    this.setState({
      popover: {
        type: null,
        attachedTo: null,
        visible: false
      }
    });
  }

  popoverChildren() {
    if (this.state.popover.visible && this.state.popover.type) {
      switch(this.state.popover.type) {
        case 'due-date':
          return (
            <DueDateForm
              dueDate={this.state.card.due_date}
              onClose={this.handleClosePopover}
              onSubmit={this.handleDueDateSubmit}
              onRemove={this.handleDueDateRemove}
            />
          );
        case 'labels':
          return (
            <LabelsForm
              selectedLabels={this.state.card.labels}
              onClose={this.handleClosePopover}
              onClickLabel={this.handleToggleLabel}
              onToggleColorblind={this.handleToggleColorblind}
            />
          );
        case 'move-card':
          return (
            <MoveCardFormContainer
              onClose={this.handleClosePopover}
              card={this.state.card}
            />
          )
        case 'copy-card':
          return (
            <CopyCardFormContainer
              onClose={this.handleClosePopover}
              card={this.state.card}
            />
          )
      }
    }
  }

  list = () => {
    const store = this.context.store;
    const state = store.getState();

    return state.lists.find(list => list.id === this.state.card.list_id);
  };

  listTitle = () => {
    const list = this.list();

    return list && list.title || '';
  }

  render() {
    if (this.state.card) {
      return (
        <div>
          <Card 
            card={this.state.card}
            title={this.state.title}
            listTitle={this.listTitle()}
            onTitleChange={this.handleTitleChange}
            onTitleBlur={this.handleTitleBlur}
            onTitleKeyPress={this.handleTitleKeyPress}
            onArchiveClick={this.handleArchiveClick}
            onUnarchiveClick={this.handleUnarchiveClick}
            onToggleCompleted={this.handleToggleCompleted}
            onOverlayClick={this.handleOverlayClick}
            onCardClick={this.handleCardClick}
            showPopover={this.handleShowPopover}
            comments={this.gatherComments()}
            currentBoardId={this.cardOriginallyRenderedFromBoardId}
          />
          <Popover {...this.state.popover}>
            {this.popoverChildren()}
          </Popover>
        </div>
      );
    } else {
      return null;
    }
  };
}

export default withRouter(CardContainer);
