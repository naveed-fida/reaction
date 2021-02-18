import React from 'react'
import PropTypes from 'prop-types';

class CreateListTile extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    showForm: PropTypes.bool,
    onTileClick: PropTypes.func,
    onCloseClick: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func
  };

  componentDidUpdate() {
    if (this.props.showForm) {
      this.refs.input.focus();
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });

      this.refs.submitButton.dispatchEvent(event);
    }
  };

  render() {
    const classes = ["new-list"];
    if (this.props.showForm) { classes.push('selected') }

    return (
      <div 
        id="new-list" 
        className={classes.join(" ")} 
        onClick={this.props.onTileClick}
      >
        <span>Add a list...</span>
        <input
          type="text" 
          placeholder="Add a list..." 
          ref="input" 
          value={this.props.title} 
          onChange={this.props.onChange}
          onKeyPress={this.handleKeyPress}
        />
        <div>
          <input
            type="submit"
            className="button"
            value="Save"
            ref="submitButton"
            onClick={this.props.onSubmit}
          />
          <i 
            className="x-icon icon"
            onClick={this.props.onCloseClick}
          ></i>
        </div>
      </div>
    );
  }
}

export default CreateListTile;
