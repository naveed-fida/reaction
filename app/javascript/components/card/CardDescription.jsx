import React from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';

const converter = new showdown.Converter();
converter.setFlavor('github');

const CardDescription = (props) => (
  <form className="description">
    <p>Description</p>
    {
      props.showForm ? null : (
        <span 
          id="description-edit"
          className="link"
          onClick={props.onEditClick}
        >Edit</span>
      )
    }
    {
      props.showForm ? (
        <div>
          <textarea
            className="textarea-toggle"
            rows="1"
            value={props.description}
            autoFocus={true}
            onBlur={props.onInputBlur}
            onChange={props.onChange}
          ></textarea>
          <div>
            <div
              className="button"
              value="Save"
              onClick={props.onSaveClick}
            >{props.isSaving ? "Saving..." : "Save"}</div>
            <i className="x-icon icon"></i>
          </div>
        </div>
      ) : (
        <p className="textarea-overlay" dangerouslySetInnerHTML={{__html: converter.makeHtml(props.description)}}></p>
      )
    }
    {
      props.edited && !props.showForm ? (
        <p id="description-edit-options">
          You have unsaved edits on this field. <span
            className="link"
            onClick={props.onEditClick}
          >View edits</span> - <span
            className="link"
            onClick={props.onDiscardChangeClick}
          >Discard</span>
        </p>
      ) : null
    }
  </form>
);

CardDescription.propTypes = {
  description: PropTypes.string,
  showForm: PropTypes.bool,
  onEditClick: PropTypes.func,
  onInputBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSaveClick: PropTypes.func,
  onDiscardChangeClick: PropTypes.func,
  isSaving: PropTypes.bool,
  edited: PropTypes.bool 
}

export default CardDescription;
