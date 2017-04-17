import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './App';
import StartApp from './StartApp';
import OrganizationApp from './OrganizationApp';
import {
  Login,
  FeaturePlanningContainer,
  Register,
  EffortEstimationContainer,
  OrganizationHome,
  NewOrgContainer,
  NoOrgContainer,
  NewProject,
  ProjectHome,
  ResultPlanningContainer,
  BacklogContainer,
  Board,
  NewTask,
  Profile,
  OrganizationSetting,
  ProjectSetting,
  RetrospectiveContainer,
  NewRetrospective,
  Management,
} from './components';
import configureStore from './store/configure-store';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={OrganizationApp}>
        <IndexRoute component={NoOrgContainer} />
        <Route path="profile" component={Profile} />
        <Route path="organizations/new" component={NewOrgContainer} />
        <Route path="organizations/:organizationId">
          <IndexRoute component={OrganizationHome} />
          <Route path="projects/new" component={NewProject} />
          <Route path="setting" component={OrganizationSetting} />
        </Route>
      </Route>
      <Route path="/organizations/:organizationId/projects/:projectId" component={App}>
        <IndexRoute component={ProjectHome} />
        <Route path="planning">
          <IndexRoute component={ResultPlanningContainer} />
          <Route path="features" component={FeaturePlanningContainer} />
          <Route path="effort-estimation" component={EffortEstimationContainer} />
        </Route>
        <Route path="board" component={Board} />
        <Route path="backlog" component={BacklogContainer} />
        <Route path="tasks/new" component={NewTask} />
        <Route path="setting" component={ProjectSetting} />
        <Route path="retrospective" component={RetrospectiveContainer} />
        <Route path="retrospective/new" component={NewRetrospective} />
        <Route path="retrospective/management" component={Management} />
      </Route>
      <Route path="/" component={StartApp}>
        <Route path="register" component={Register} />
      </Route>
      <Route path="login" component={Login} />
      <Route path="board" component={Board} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
