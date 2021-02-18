import React from 'react';
import PropTypes from 'prop-types';

const CreateBoardTile = (props) => (
  <li 
    className="board-tile"
    onClick={props.onClick}
  >
    <a className="new-board">
      <span className="board-title">Create a new board...</span>
    </a>
  </li>
);

CreateBoardTile.propTypes = {
  onClick: PropTypes.func
}

export default CreateBoardTile;
