import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as formActions from '../../actions/FormActions';
import * as listActions from '../../actions/ListActions';
import * as listSelectors from '../../selectors/ListSelectors';
import positionCalculator from '../../lib/PositionCalculator';

import CreateListTile from './CreateListTile';

class CreateListTileContainer extends React.Component {
  state = {
    showForm: false,
    title: ''
  };

  static contextTypes = {
    store: PropTypes.object
  };

  static propTypes = {
    match: PropTypes.object
  };

  handleTileClick = (e) => {
    e.stopPropagation();

    this.setState({
      showForm: true
    });
  };

  handleCloseClick = (e) => {
    e.stopPropagation();

    this.setState({
      showForm: false
    });
  };

  handleChange = (e) => {
    this.setState({
      title: e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault;

    const boardId = Number(this.props.match.params.id);

    const currentState = this.context.store.getState();
    const lists = listSelectors.boardListsSelector(
      currentState, boardId 
    ).sort((a, b) => a.position - b.position);
    const position = positionCalculator(lists, lists.length + 1);

    this.context.store.dispatch(
      listActions.createList(
        boardId, {
          title: this.state.title,
          position
        }, () => {
          this.setState({
            showForm: false,
            title: ''
          });
        }
      )
    );
  };

  render() {
    return (
      <CreateListTile
        showForm={this.state.showForm}
        title={this.state.title}
        onTileClick={this.handleTileClick}
        onCloseClick={this.handleCloseClick}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  };
}

export default withRouter(CreateListTileContainer);
