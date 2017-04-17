import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import user from './user-reducer';
import organization from './organization-reducer';
import project from './project-reducer';
import planning from './planning-reducer';
import lists from './list-reducer';
import retrospective from './retrospective-reducer';
import permission from './permission-reducer';

const rootReducer = combineReducers({
  user,
  organization,
  project,
  planning,
  lists,
  retrospective,
  permission,
  routing: routerReducer,
});

export default rootReducer;
