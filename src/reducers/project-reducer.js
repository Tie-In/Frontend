import * as types from '../actions/action-types';

const initialState = {
  project: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PROJECT:
      return Object.assign({}, action.project);
    default:
      return state;
  }
};
