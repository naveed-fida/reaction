import React from 'react';
import PropTypes from 'prop-types';

const BoardHeader = props => (
  <header>
    <ul>
      <li id="title">{props.title}</li>
      <li className="star-icon icon"></li>
      <li className="private private-icon icon">Private</li>
    </ul>
    <div className="menu">
      <i className="more-icon sm-icon"></i>Show Menu</div>
    <div className="subscribed">
      <i className="sub-icon sm-icon"></i>Subscribed</div>
  </header>
);

BoardHeader.propTypes = {
  title: PropTypes.string
};

export default BoardHeader;
