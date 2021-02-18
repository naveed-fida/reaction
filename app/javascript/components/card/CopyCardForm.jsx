import React from 'react';
import PropTypes from 'prop-types';

import CardLocationFormContainer from './CardLocationFormContainer';

const CopyCardForm = (props) => (
  <div>
    <header>
      <span>Copy Card</span>
      <a
        href="#"
        className="icon-sm icon-close"
        onClick={props.onCloseClick}
      ></a>
    </header>
    <div className="content">
      <label>Title</label>
      <textarea
        name="name"
        style={{marginBottom: '12px'}}
        value={props.title}
        onChange={props.onTitleChange}
      ></textarea>

      {
        props.commentsCount ? (
          <div>
            <label>Keep…</label>
            <div className="check-div clearfix">
              <input
                id="keep-comments"
                type="checkbox"
                name="comments"
                checked={props.keepComments}
                onChange={props.onKeepCommentsChange}
              />
              <label htmlFor="keep-comments">
                Comments <span className="quiet">({props.commentsCount})</span>
              </label>
            </div>
            <br />
          </div>
        ) : null
      }

      <label>Copy to…</label>
      <CardLocationFormContainer 
        card={props.card}
        onLocationChange={props.onLocationChange}
        mode="copy"
      />

      <button
        className="button"
        type="submit"
        onClick={props.onSubmit}
      >Create Card</button>
    </div>
  </div>
);

CopyCardForm.propTypes = {
  card: PropTypes.object,
  title: PropTypes.string,
  commentsCount: PropTypes.number,
  keepComments: PropTypes.bool,
  onCloseClick: PropTypes.func,
  onTitleChange: PropTypes.func,
  onKeepCommentsChange: PropTypes.func,
  onLocationChange: PropTypes.func,
  onSubmit: PropTypes.func
}

export default CopyCardForm;
