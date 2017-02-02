import * as types from './action-types';

export const setFeatures = (features) => {
  return {
    type: types.SET_FEATURES,
    features,
  };
};

export const setEffortEstimation = (effortEstimation) => {
  return {
    type: types.SET_EFFORT_ESTIMATIONS,
    effortEstimation,
  };
};
