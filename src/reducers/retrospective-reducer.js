import * as types from '../actions/action-types';

const initialState = {
  comments: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_COMMENTS:
      return Object.assign({}, state, {
        features: action.comments,
      });
    default:
      return state;
  }
};
