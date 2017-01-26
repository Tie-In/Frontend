import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  Login,
  FeaturePlanningContainer,
  Register,
  EffortEstimationContainer,
  NoOrgContainer,
  NewOrgContainer,
} from './components';
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
        <Route path="/project/1/planning/features" component={FeaturePlanningContainer} />
        <Route path="/project/1/planning/effort_estimation" component={EffortEstimationContainer} />
        <Route path="no-organization" component={NoOrgContainer} />
        <Route path="new-organization" component={NewOrgContainer} />
      </Route>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
