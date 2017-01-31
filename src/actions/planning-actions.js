import * as types from './action-types';

export const setFeatures = (features) => {
  return {
    type: types.SET_FEATURES,
    features,
  };
};
