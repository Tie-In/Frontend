import * as types from '../actions/action-types';

const initialState = {
  features: [],
  effortEstimation: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_FEATURES:
      return Object.assign({}, state, {
        features: action.features,
      });
    case types.SET_EFFORT_ESTIMATIONS:
      console.log(action.effortEstimation);
      console.log(state);
      return Object.assign({}, state, {
        effortEstimation: action.effortEstimation,
      });
    default:
      return state;
  }
};
