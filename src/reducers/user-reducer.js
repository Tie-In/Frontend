import * as types from '../actions/action-types';

const initialState = {
  user: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_USER:
      return Object.assign({}, action.user);
    default:
      return state;
  }
};
