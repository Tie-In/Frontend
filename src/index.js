import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './App';
import StartApp from './StartApp';
import {
  Login,
  FeaturePlanningContainer,
  Register,
  EffortEstimationContainer,
  OrganizationContainer,
  NewOrgContainer,
  NoOrgContainer,
  NewProject,
  ProjectHomeContainer,
} from './components';
import configureStore from './store/configure-store';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={NoOrgContainer} />
        <Route path="organization-new" component={NewOrgContainer} />
        <Route path="organizations/:organizationId">
          <IndexRoute component={OrganizationContainer} />
          <Route path="project-new" component={NewProject} />
          <Route path="projects/:projectId">
            <IndexRoute component={ProjectHomeContainer} />
            <Route path="planning/features" component={FeaturePlanningContainer} />
            <Route path="planning/effort_estimation" component={EffortEstimationContainer} />
          </Route>
        </Route>
      </Route>
      <Route path="/" component={StartApp}>
        <Route path="/register" component={Register} />
      </Route>
      <Route path="/login" component={Login} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
