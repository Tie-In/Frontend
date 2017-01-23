import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
// import people from './people-reducer';
import user from './user-reducer';

const rootReducer = combineReducers({
  user,
  routing: routerReducer,
});

export default rootReducer;
