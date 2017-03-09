import * as types from './action-types';

export const setSprintTasks = (tasks) => {
  return {
    type: types.SET_SPRINT_TASKS,
    tasks,
  };
};

export const updateTask = (task) => {
  return {
    type: types.UPDATE_TASK,
    task,
  };
};
