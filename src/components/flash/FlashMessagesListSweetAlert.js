import React from 'react';
import FlashMessageSweetAlert from './FlashMessageSweetAlert';
import { connect } from 'react-redux';
import { deleteFlashMessage } from '../../actions/flashMessages';
import PropTypes from 'prop-types';

class FlashMessagesListSweetAlert extends React.Component {
  render() {
    const messages = this.props.messages.map(message =>
      <FlashMessageSweetAlert key={message.id} message={message} deleteFlashMessage={this.props.deleteFlashMessage} />
    );
    return (
      <div>{messages}</div>
    );
  }
}

FlashMessagesListSweetAlert.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessage: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    messages: state.flashMessages
  }
}

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesListSweetAlert);