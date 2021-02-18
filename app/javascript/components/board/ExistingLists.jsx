import React from 'react';
import PropTypes from 'prop-types';
import dragula from 'react-dragula';

import * as listSelectors from '../../selectors/ListSelectors';
import * as cardSelectors from '../../selectors/CardSelectors';
import * as cardActions from '../../actions/CardActions';
import calculatePosition from '../../lib/PositionCalculator';

import DraggableList from './../list/DraggableList';

class ExistingLists extends React.Component {
  state = {
    lists: [],
    addCardActiveListId: null,
    newCardFormText: ''
  };

  static propTypes = {
    boardId: PropTypes.number.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  updateLists = () => {
    this.setState({
      lists: this.getLists(),
    });
  };

  componentDidMount() {
    const store = this.context.store;

    this.unsubscribe = store.subscribe(() => this.updateLists());
    this.updateLists();

    this.cardDrake = dragula({
      isContainer: function (el) {
        return el.id === 'cards-container';
      }
    });

    this.cardDrake.on('drop', (el) => {
      const store = this.context.store;
      const state = store.getState();
      const droppedEl = el;
      const cardId = Number(el.dataset.cardId);
      const list = el.closest('.list-wrapper');
      const listId = Number(list.dataset.listId);
      const siblings = Array.prototype.slice.call(droppedEl.parentNode.childNodes);
      const cards = cardSelectors.listCards(state, listId);
      const targetIndex = siblings.indexOf(droppedEl);
      const sortedStartingCards = cards
        .slice()
        .sort((a, b) => a.position - b.position);
      let sourceIndex = sortedStartingCards.findIndex(card => card.id === cardId);
      if (sourceIndex === -1) sourceIndex = null;

      const newPosition = calculatePosition(cards, targetIndex, sourceIndex);

      el.setAttribute("style", `${el.style.cssText};display: none;`);

      this.cardDrake.cancel(true)

      store.dispatch(
        cardActions.updateCard(cardId, { 
          position: newPosition,
          list_id: listId
        }, () => {
          el.setAttribute("style", el.style.cssText.replace('display: none;', ''));
        })
      );
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.cardDrake.destroy();
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = {
        direction: 'horizontal',
        moves: function (el, source, handle, sibling) {
          return !handle.closest("#cards-container");
        },
        accepts: function (el, target, source, sibling) {
          return !el.closest("#cards-container");
        }
      };

      dragula([componentBackingInstance], options)
        .on('drop', function (el) {
          el.dispatchEvent(new Event("drop", { "bubbles": true }));
        });
    }
  };

  getLists = () => {
    const store = this.context.store;
    return listSelectors.boardListsSelector(store.getState(), this.props.boardId);
  }

  sortedLists = () => {
    const listCopy = this.state.lists.slice();
    return listCopy.sort((a, b) => a.position - b.position);
  }

  handleAddCardClick = (e, id) => {
    this.setState({
      addCardActiveListId: id
    });
  };

  handleNewCardFormChange = (e) => {
    this.setState({
      newCardFormText: e.target.value
    });
  };

  handleNewCardFormKeyPress = (e) => {
    const store = this.context.store;

    if (e.key === 'Enter') {
      e.preventDefault();

      this.handleNewCardFormSubmit(new Event("submit"), true);
    }
  };

  handleNewCardFormSubmit = (e, keepOpen) => {
    const store = this.context.store;
    const currentCards = cardSelectors.listCards(
      store.getState(),
      this.state.addCardActiveListId
    );
    const position = calculatePosition(currentCards, currentCards.length);

    e.preventDefault();

    let callback;

    if (keepOpen) { 
      callback = () => this.setState({ newCardFormText: '' });
    } else {
      callback = this.handleNewCardFormClose;
    }

    store.dispatch(cardActions.createCard(this.state.addCardActiveListId, {
      title: this.state.newCardFormText,
      position
    }, callback));
  };

  handleNewCardFormClose = () => {
    this.setState({
      addCardActiveListId: null,
      newCardFormText: ''
    });
  };

  render() {
    return (
      <div 
        id="existing-lists"
        className="existing-lists"
        ref={this.dragulaDecorator}
      >
        {
          this.sortedLists().map(list => (
            <DraggableList
              key={list.id}
              list={list}
              onAddCardClick={this.handleAddCardClick}
              addCardActive={this.state.addCardActiveListId === list.id}
              onNewCardFormChange={this.handleNewCardFormChange}
              onNewCardFormClose={this.handleNewCardFormClose}
              onNewCardFormSubmit={this.handleNewCardFormSubmit}
              onNewCardFormKeyPress={this.handleNewCardFormKeyPress}
              newCardFormText={this.state.newCardFormText}
            />
          ))
        }
      </div>
    );
  }
}

export default ExistingLists;
