import * as types from '../actions/action-types';

const initialState = {
  features: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_FEATURES:
      return Object.assign({}, state, {
        features: action.features,
      });
    default:
      return state;
  }
};
