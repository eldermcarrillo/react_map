import React from 'react';
import ReactDOM from 'react-dom';
import { render } from "react-dom";

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import Markers from './content';
import rootReducer from '../../rootReducer';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Markers/>
  </Provider>, document.getElementById('root')
);