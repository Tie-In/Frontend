import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import StartApp from './StartApp'
import {
  Login,
  FeaturePlanningContainer,
  Register,
  EffortEstimationContainer,
  OrganizationContainer,
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
        <Route path="/organizations" component={OrganizationContainer} />
        <Route path="/organizations/new" component={NewOrgContainer} />
      </Route>
      <Route path="/" component={StartApp}>
        <Route path="/register" component={Register} />
      </Route>
      <Route path="/login" component={Login} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
