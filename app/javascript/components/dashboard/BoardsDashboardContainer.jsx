import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BoardsDashboard from './BoardsDashboard';
import NewBoardFormContainer from './NewBoardFormContainer';
import Popover from '../shared/Popover';

import * as actions from '../../actions/BoardActions';

class BoardsDashboardContainer extends React.Component {
  state = {
    popover: {
      visible: false,
      attachedTo: null,
      type: null
    }
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    const store = this.context.store;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
    store.dispatch(actions.fetchBoards());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  allBoards = () => {
    const store = this.context.store;
    return store.getState().boards;
  }

  handleNewBoardClick = (e) => {
    this.setState({
      popover: {
        visible: true,
        attachedTo: e.currentTarget,
        type: 'new-board'
      }
    });
  };

  handleClosePopoverClick = (e) => {
    e.preventDefault();

    this.setState({
      popover: {
        visible: false,
        attachedTo: null,
        type: null
      }
    });
  };

  render() {
    return (
      <div>
        <BoardsDashboard
          boards={this.allBoards()}
          onNewBoardClick={this.handleNewBoardClick}
        />
        <Popover {...this.state.popover} coverTarget={true}>
          <NewBoardFormContainer onCloseClick={this.handleClosePopoverClick}/>
        </Popover>
      </div>
    )
  }
}

export default BoardsDashboardContainer;
