import React from 'react';
import FlashMessageModal from './FlashMessageModal';
import { connect } from 'react-redux';
import { deleteFlashMessageModal } from '../../actions/flashMessages';
import PropTypes from 'prop-types';

class FlashMessagesListModal extends React.Component {
  render() {
    const messages = this.props.messages.map(message =>
      <FlashMessageModal key={message.id} message={message} deleteFlashMessageModal={this.props.deleteFlashMessageModal} />
    );
    return (
      <div style={{ paddingTop: '0px' }}>{messages}</div>
    );
  }
}

FlashMessagesListModal.propTypes = {
  messages: PropTypes.array.isRequired,
  deleteFlashMessageModal: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    messages: state.flashMessagesModal
  }
}

export default connect(mapStateToProps, { deleteFlashMessageModal })(FlashMessagesListModal);