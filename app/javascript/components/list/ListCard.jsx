import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as selectors from '../../selectors/CommentSelectors';

const hasComments = (card) => {
  return card.comments_count;
}

const hasDueDate = (card) => {
  return !!card.due_date;
}

const hasDescription = (card) => {
  const description = card.description;

  return description && description.trim().length > 0;
}

const formattedDueDate = (card) => {
  const momentDate = moment(card.due_date);
  let formatString;

  if (momentDate.toDate().getFullYear() === (new Date()).getFullYear()) {
    formatString = 'MMM D';
  } else {
    formatString = 'MMM D, YYYY';
  }

  let formatted = momentDate.format(formatString);

  return `${formatted}`;
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
    return "";
  }
};

const ListCard = (props) => (
  <Link 
    to={`/cards/${props.card.id}`}
    data-card-id={props.card.id}
  >
    <div className="card-background">
        <div className="card "><i className="edit-toggle edit-icon sm-icon"></i>
            <div className="card-info">
              {
                props.card.labels.map((label, index) => (
                  <div 
                    className={`card-label ${label} colorblindable`}
                    key={index}
                  ></div>
                ))
              }
              <p>{props.card.title}</p>
            </div>
            <div className="card-icons">
              {
                hasDueDate(props.card) ? (
                  <i className={`clock-icon sm-icon ${dueClass(props.card)}`}>
                    {formattedDueDate(props.card)} 
                  </i>
                ) : null
              }
              {
                hasDescription(props.card) ? (
                  <i className="description-icon sm-icon"></i>
                ) : null
              }
              {
                hasComments(props.card) ? (
                  <i className="comment-icon sm-icon"></i>
                ) : null
              }
            </div>
        </div>
    </div>
  </Link>
);

ListCard.propTypes = {
  card: PropTypes.object
};

export default ListCard;
