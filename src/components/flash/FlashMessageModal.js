import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class FlashMessageModal extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount(){
    setTimeout(this.tickTack.bind(this), 5000);
  }

  tickTack(){
    this.props.deleteFlashMessageModal(this.props.message.id);
  }

  onClick() {
    this.props.deleteFlashMessageModal(this.props.message.id);
  }

  render() {
    const { id, type, text } = this.props.message;
    return (
      <div className={classnames('alert', {
        'alert-success': type === 'success',
        'alert-danger': type === 'error',
        'alert-warning': type === 'warning'
      })}>
        <button onClick={this.onClick} className="close"><span>&times;</span></button>
        {text}
      </div>
    );
  }
}

FlashMessageModal.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessageModal: PropTypes.func.isRequired
}

export default FlashMessageModal;
