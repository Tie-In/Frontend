import * as types from '../actions/action-types';

const initialState = {
  tasks: [],
  task: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SPRINT_TASKS:
      return Object.assign({}, state, {
        tasks: action.tasks,
      });
    case types.UPDATE_TASK:
      return Object.assign({}, state, {
        task: action.task,
      });
    default:
      return state;
  }
};
