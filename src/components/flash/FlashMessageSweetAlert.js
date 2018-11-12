import React from 'react';
import PropTypes from 'prop-types';
import SweetAlert from 'react-bootstrap-sweetalert'

window.SweetAlert = SweetAlert;

class FlashMessageSweetAlert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: null
    }

    this.onConfirm = this.onConfirm.bind(this)
  }

  onConfirm() {
    this.setState({
      alert: null
    });
    this.props.deleteFlashMessage(this.props.message.id);
  }
  

  render() {
    const { id, type, text } = this.props.message;
    return (
      <div>
        <SweetAlert type={type} title={text} onConfirm={this.onConfirm}/>
      </div>
    );
  }
}

FlashMessageSweetAlert.propTypes = {
  message: PropTypes.object.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessageSweetAlert;
