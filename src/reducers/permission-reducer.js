import {
  SET_PERMISSION_ORG,
  SET_PERMISSION_PROJECT,
} from '../actions/permission-actions';

const initialState = {
  organization: '',
  project: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PERMISSION_ORG:
      return Object.assign({}, state, {
        organization: action.value,
      });
    case SET_PERMISSION_PROJECT:
      return Object.assign({}, state, {
        project: action.value,
      });
    default:
      return state;
  }
};
