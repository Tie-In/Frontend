import rootReducer from '../reducers';
import { compose, createStore } from 'redux';
import persistState from 'redux-localstorage'

export default (initialState) => {
  const enhancer = compose(
    persistState(),
  );
  return createStore(rootReducer, initialState, enhancer);
};
