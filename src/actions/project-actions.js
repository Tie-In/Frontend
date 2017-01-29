import * as types from './action-types';

export const setProject = (project) => {
  return {
    type: types.SET_PROJECT,
    project,
  };
};
