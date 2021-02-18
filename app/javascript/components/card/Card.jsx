import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import EditableCardDescription from './EditableCardDescription';
import NewCommentFormContainer from './NewCommentFormContainer';
import DueDateForm from './DueDateForm';

import * as boardSelectors from '../../selectors/BoardSelectors';

const formattedDueDate = (card) => {
  const momentDate = moment(card.due_date);
  let formatString;

  if (momentDate.toDate().getFullYear() === (new Date()).getFullYear()) {
    formatString = 'MMM D [at] h:mm A';
  } else {
    formatString = 'MMM D, YYYY [at] h:mm A';
  }

  let formatted = momentDate.format(formatString);

  return `${formatted}${dueStatus(card)}`;
}

const dueClass = (card) => {
  var diff = (moment(card.due_date).toDate() - new Date()) / (1000 * 60 * 60 * 24);

  if (card.completed) {
    return "completed";
  } else if (diff < -1) {
    return "overdue";
  } else if (diff < 0) {
    return "overdue-recent";
  } else if (diff < 1) {
    return "due-soon";
  } else {
    return "due-later";
  }
};

const dueStatus = (card) => {
  var diff = (moment(card.due_date).toDate() - new Date()) / (1000 * 60 * 60 * 24);

  if (card.completed) {
    return "";
  } else if (diff < -1) {
    return " (past due)";
  } else if (diff < 0) {
    return " (recently past due!)";
  } else if (diff < 1) {
    return " (due soon)";
  } else {
    return "";
  }
};

const Card = (props) => {
  if (props.card) {
    const comments = props.comments.map((comment) => (
      comment.isAction ? (
        <li key={`action_${comment.id}`}>
          <div className="member-container">
            <div className="card-member small-size">VR</div>
          </div>
          <p>
            <span className="member-name">Victor Reyes</span> {comment.description} <small>{moment(comment.created_at).fromNow()}</small>
          </p>
        </li>
      ) : (
        <li key={`comment_${comment.id}`}>
          <div className="member-container">
            <div className="card-member">TP</div>
          </div>
          <h3>Taylor Peat</h3>
          <div className="comment static-comment">
            <span>{comment.text}</span>
          </div>
          <small>{moment(comment.created_at).fromNow()} - <span className="link">Edit</span> - <span className="link">Delete</span></small>
        </li>
      )
    ));

    return (
      <div>
        <div id="modal-container">
          <div className="screen"
            onClick={props.onOverlayClick}
          ></div>
          <div
            id="modal"
            onClick={props.onCardClick}
          >
            <Link to={`/boards/${props.currentBoardId}`}>
              <i className="x-icon icon close-modal"></i>
            </Link>
            {
              props.card.archived ? (
                <div className="archived-banner">
                  <i className="file-icon icon"></i>
                  This card is archived.
                </div>
              ) : null
            }
            <header>
              <i className="card-icon icon"></i>
              <textarea
                className="list-title"
                style={{height: '45px'}}
                value={props.title}
                onChange={props.onTitleChange}
                onBlur={props.onTitleBlur}
                onKeyPress={props.onTitleKeyPress}
              ></textarea>
              <p>{"in list "}
              <a
                className="link"
                onClick={(e) => props.showPopover(e, 'move-card')}
              >{props.listTitle}</a><i className="sub-icon sm-icon"></i>
              </p>
            </header>
            <section className="modal-main">
              <ul className="modal-outer-list">
                <li className="details-section">
                  <ul className="modal-details-list">
                    {
                      props.card.labels.length > 0 ? (
                        <li className="labels-section">
                          <h3>Labels</h3>
                          {
                            props.card.labels.map((label) => (
                              <div
                                className="member-container"
                                key={label}
                                onClick={(e) => props.showPopover(e, 'labels')}
                              >
                                <div className={`${label} label colorblindable`}></div>
                              </div>
                            ))
                          }
                          <div
                            className="member-container"
                            onClick={(e) => props.showPopover(e, 'labels')}
                          >
                            <i className="plus-icon sm-icon"></i>
                          </div>
                        </li>
                      ) : null
                    }
                    {
                      props.card.due_date ? (
                        <li className="due-date-section">
                          <h3>Due Date</h3>
                          <div id="dueDateDisplay"
                            className={dueClass(props.card)}
                            onClick={(e) => props.showPopover(e, 'due-date')}
                          >
                            <input id="dueDateCheckbox"
                              type="checkbox"
                              className="checkbox"
                              checked={props.card.completed}
                              onClick={props.onToggleCompleted}
                            />{formattedDueDate(props.card)}
                          </div>
                        </li>
                      ) : null
                    }
                  </ul>
                  <EditableCardDescription
                    description={props.card.description}
                    id={props.card.id}
                  />
                </li>
                <li className="comment-section">
                  <NewCommentFormContainer card={props.card} />
                </li>
                <li className="activity-section">
                  <h2 className="activity-icon icon">Activity</h2>
                  <ul className="horiz-list">
                    <li className="not-implemented">Show Details</li>
                  </ul>
                  <ul className="modal-activity-list">
                    {comments}
                  </ul>
                </li>
              </ul>
            </section>
            <aside className="modal-buttons">
              <h2>Add</h2>
              <ul>
                <li className="member-button"><i className="person-icon sm-icon"></i>Members</li>
                <li
                  className="label-button"
                  onClick={(e) => props.showPopover(e, 'labels')}
                ><i className="label-icon sm-icon"></i>Labels</li>
                <li className="checklist-button"><i className="checklist-icon sm-icon"></i>Checklist</li>
                <li 
                  className="date-button"
                  onClick={(e) => props.showPopover(e, 'due-date')}
                ><i className="clock-icon sm-icon"></i>Due Date</li>
                <li className="attachment-button not-implemented"><i className="attachment-icon sm-icon"></i>Attachment</li>
              </ul>
              <h2>Actions</h2>
              <ul>
                <li
                  className="move-button"
                  onClick={(e) => props.showPopover(e, 'move-card')}
                ><i className="forward-icon sm-icon"></i>Move</li>
                <li
                  className="copy-button"
                  onClick={(e) => props.showPopover(e, 'copy-card')}
                ><i className="card-icon sm-icon"></i>Copy</li>
                <li className="subscribe-button"><i className="sub-icon sm-icon"></i>Subscribe<i className="check-icon sm-icon"></i>
                </li>
                <hr />
                {
                  props.card.archived ? (
                    <div>
                      <li 
                        className="unarchive-button"
                        onClick={props.onUnarchiveClick}
                      ><i className="send-icon sm-icon"></i>Send to board</li>
                      <li className="red-button"><i className="minus-icon sm-icon"></i>Delete</li>
                    </div>
                  ) :  (
                    <li 
                      className="archive-button"
                      onClick={props.onArchiveClick}
                    ><i className="file-icon sm-icon "></i>Archive</li>
                  )
                }
              </ul>
              <ul className="light-list">
                <li className="not-implemented">Share and more...</li>
              </ul>
            </aside>
          </div>
        </div>
      </div>
    )
  } else {
    return <div></div>;
  }
};

Card.propTypes = {
  card: PropTypes.object,
  comments: PropTypes.array,
  onOverlayClick: PropTypes.func,
  onCardClick: PropTypes.func,
  onTitleChange: PropTypes.func,
  onTitleBlur: PropTypes.func,
  onTitleKeyPress: PropTypes.func,
  onToggleCompleted: PropTypes.func,
  onUnarchiveClick: PropTypes.func,
  onArchiveClick: PropTypes.func,
  currentBoardId: PropTypes.number,
  title: PropTypes.string,
  showPopover: PropTypes.func,
  listTitle: PropTypes.string
}

export default Card;
