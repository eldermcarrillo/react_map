import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({ field, value, label, error, type, placeHolder, required, onChange }) => {
  return (
    <div className={classnames('form-group', { 'has-error': error })}>
      <label className="control-label">{label}</label><span style={{ color: 'red' }}> { required ? '*' : '' }</span>
      <input
        onChange={onChange}
        value={value}
        type={type}
        name={field}
        className="form-control"
        placeholder={placeHolder}
      />
      {error && <span className="help-block">{error}</span>}
    </div> );
}

TextFieldGroup.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeHolder: PropTypes.string.isRequired,
  required: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

TextFieldGroup.defaultProps = {
  type: 'text',
  required: '',
  value:''
}

export default TextFieldGroup;
