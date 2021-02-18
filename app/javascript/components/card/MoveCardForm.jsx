import React from 'react';
import PropTypes from 'prop-types';

import CardLocationFormContainer from './CardLocationFormContainer';

const MoveCardForm = (props) => (
  <div>
    <header>
      <span>Move Card</span>
      <a
        href="#"
        className="icon-sm icon-close"
        onClick={props.onCloseClick}
      ></a>
    </header>
    <div className="content">
      <CardLocationFormContainer 
        card={props.card}
        onLocationChange={props.onLocationChange}
      />
      <button
        className="button"
        type="submit"
        onClick={props.onSubmit}
        disabled={props.isSubmitDisabled}
      >Move</button>
    </div>
  </div>
);

MoveCardForm.propTypes = {
  card: PropTypes.object,
  isSubmitDisabled: PropTypes.bool,
  onCloseClick: PropTypes.func,
  onLocationChange: PropTypes.func,
  onSubmit: PropTypes.func
}

export default MoveCardForm;
