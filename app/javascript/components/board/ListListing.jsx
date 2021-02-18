import React from 'react';
import PropTypes from 'prop-types';

import ExistingLists from './ExistingLists';
import CreateListTileContainer from './CreateListTileContainer';

const ListListing = props => (
  <div id="list-container" className="list-container">
    <ExistingLists boardId={props.boardId} />
    <CreateListTileContainer />
  </div>
);

ListListing.propTypes = {
  boardId: PropTypes.number
};

export default ListListing;
