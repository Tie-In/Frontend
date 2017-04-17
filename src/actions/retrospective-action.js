import * as types from './action-types';

export const setComments = (comments) => {
  return {
    type: types.SET_COMMENTS,
    comments,
  };
};
