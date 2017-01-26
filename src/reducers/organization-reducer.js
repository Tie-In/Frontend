import * as types from '../actions/action-types';

const initialState = {
  organization: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_ORGANIZATION:
      return Object.assign({}, action.organization);
    default:
      return state;
  }
};
