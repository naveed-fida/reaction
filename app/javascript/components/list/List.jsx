import React from 'react';
import PropTypes from 'prop-types';

import EditableListTitle from './EditableListTitle';
import CardListing from './CardListing';
import NewCardForm from './NewCardForm';

import * as selectors from '../../selectors/CardSelectors';

const List = props => (
  <div
    className={`list-wrapper ${props.addCardActive ? 'add-dropdown-active' : ''}`}
    data-list-id={props.list.id}
    onDrop={props.onDrop}
  >
      <div className="list-background">
          <div className="list">
              <a className="more-icon sm-icon" href=""></a>
              <EditableListTitle list={props.list} />
              <div className="add-dropdown add-top">
                  <div className="card"></div>
                  <a className="button">Add</a><i className="x-icon icon"></i>
                  <div className="add-options"><span>...</span>
                  </div>
              </div>
              <CardListing cards={props.cards} />
              {
                props.addCardActive ?
                <NewCardForm 
                  value={props.newCardFormText}
                  onChange={props.onNewCardFormChange}
                  onSubmit={props.onNewCardFormSubmit}
                  onClose={props.onNewCardFormClose}
                  onKeyPress={props.onNewCardFormKeyPress}
                /> : null
              }
              <div
                className="add-card-toggle"
                data-position="bottom"
                onClick={(e) => props.onAddCardClick(e, props.list.id)}
              >Add a card...</div>
          </div>
      </div>
  </div>
);

List.propTypes = {
  cards: PropTypes.array,
  list: PropTypes.object.isRequired,
  addCardActive: PropTypes.bool.isRequired,
  newCardFormText: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  onAddCardClick: PropTypes.func.isRequired,
  onNewCardFormChange: PropTypes.func.isRequired,
  onNewCardFormSubmit: PropTypes.func.isRequired,
  onNewCardFormClose: PropTypes.func,
  onNewCardFormKeyPress: PropTypes.func
};

export default List;
