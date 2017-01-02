import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import people from './people-reducer';

const rootReducer = combineReducers({
  people,
  routing: routerReducer,
});

export default rootReducer;
