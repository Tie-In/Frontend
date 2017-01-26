import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import people from './people-reducer';
import user from './user-reducer';
import organization from './organization-reducer';

const rootReducer = combineReducers({
  user,
  organization,
  routing: routerReducer,
});

export default rootReducer;
