import * as types from './action-types';

export const setUser = (user) => {
  return {
    type: types.SET_USER,
    user,
  };
};
