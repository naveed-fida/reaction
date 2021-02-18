import React from 'react';
import PropTypes from 'prop-types';

import NewCommentForm from './NewCommentForm';

import * as actions from '../../actions/CommentActions';

class NewCommentFormContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  };

  static propTypes = {
    card: PropTypes.object
  };

  state = {
    comment: '',
    isSaving: false
  };

  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleSubmit = (e) => {
    if (this.state.isSaving) { return; }

    e.preventDefault();

    this.setState({ isSaving: true });

    this.context.store.dispatch(
      actions.createComment(
        this.props.card.id, {
          text: this.state.comment
        }, () => {
          this.setState({
            comment: '',
            isSaving: false
          });
        }
      )
    )
  };

  render() {
    return (
      <NewCommentForm
        comment={this.state.comment}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        isEdited={this.state.comment.trim() !== ''}
        isSaving={this.state.isSaving}
      />
    );
  }
};

export default NewCommentFormContainer;
