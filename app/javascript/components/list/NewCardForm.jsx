import React from 'react';
import PropTypes from 'prop-types';

const NewCardForm = (props) => (
  <div className="add-dropdown add-bottom active-card">
    <div className="card">
      <div className="card-info"></div>
      <textarea 
        name="add-card"
        autoFocus={true}
        value={props.value}
        onChange={props.onChange}
        onKeyPress={props.onKeyPress}
      ></textarea>
      <div className="members"></div>
    </div>
    <a
      className="button"
      onClick={props.onSubmit}
    >Add</a>
    <i 
      className="x-icon icon"
      onClick={props.onClose}
    ></i>
    <div className="add-options"><span>...</span>
    </div>
  </div>
);

NewCardForm.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onClose: PropTypes.func
}

export default NewCardForm
