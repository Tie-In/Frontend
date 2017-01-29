import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import user from './user-reducer';
import organization from './organization-reducer';
import project from './project-reducer';

const rootReducer = combineReducers({
  user,
  organization,
  project,
  routing: routerReducer,
});

export default rootReducer;
