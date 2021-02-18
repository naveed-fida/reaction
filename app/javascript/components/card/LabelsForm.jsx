import React from 'react';
import PropTypes from 'prop-types';

const allLabels = ["green", "yellow", "orange", "red", "purple", "blue"];

const LabelsForm = (props) => {
  const labelLis = allLabels.map((label) => (
    <li
      key={label}
      onClick={(e) => props.onClickLabel(e, label)}
    >
      <div className={`${label} colorblindable`} data-id="1">
        {
          props.selectedLabels.indexOf(label) !== -1 ?
          <i className="check-icon sm-icon"></i> :
          null
        }
      </div>
      <div className={`label-background ${label}`}></div>
      <div className="label-background-overlay"></div>
      <i className="edit-icon icon not-implemented"></i>
    </li>
  ));

  return (
    <div id="add-options-labels-dropdown">
      <header>
        <span>Change due date</span>
        <a
          href="#"
          className="icon-sm icon-close"
          onClick={props.onClose}
        ></a>
      </header>
      <div className="content">
        <input className="dropdown-input" placeholder="Search labels..." type="text" />
        <div className="labels-search-results">
          <ul className="label-list">
            {labelLis}
          </ul>
          <ul className="light-list">
            <li className="not-implemented">Create a new label</li>
            <hr />
            <li
              className="toggleColorblind"
              onClick={props.onToggleColorblind}
            >Enable color blind friendly mode.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

LabelsForm.propTypes = {
  selectedLabels: PropTypes.array,
  onClickLabel: PropTypes.func,
  onClose: PropTypes.func,
  onToggleColorblind: PropTypes.func
};

export default LabelsForm;
