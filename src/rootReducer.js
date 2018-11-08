import { combineReducers } from 'redux';

import flashMessages from './reducers/flashMessages';
import flashMessagesModal from './reducers/flashMessagesModal';

export default combineReducers({
  flashMessages,
  flashMessagesModal
});
