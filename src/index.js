import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import PeopleContainer from './components';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import configureStore from './store/configure-store';
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="people" component={PeopleContainer} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
