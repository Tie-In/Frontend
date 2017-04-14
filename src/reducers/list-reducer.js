import {
  SET_LIST,
  MOVE_CARD,
  TOGGLE_DRAGGING,
} from '../actions/list-actions';
import * as apiHelper from '../helpers/apiHelper';

const initialState = {
  lists: [],
  isDragging: false,
};


export default function lists(state = initialState, action) {
  switch (action.type) {
    case SET_LIST:
      return Object.assign({}, state, {
        lists: action.lists,
      });
    case MOVE_CARD: {
      const newLists = [...state.lists];
      const { lastX, lastY, nextX } = action;
      let { nextY } = action;
      const movedTask = newLists[lastX].tasks[lastY];
      // re-confirm index before send to API
      if (newLists[nextX].tasks.length === 0 && nextY > 0) {
        nextY = 0;
      } else if (nextY === newLists[nextX].tasks.length) {
        nextY = newLists[nextX].tasks.length - 1;
      } else if (nextY > newLists[nextX].tasks.length) {
        nextY = newLists[nextX].tasks.length;
      }
      if (lastX === nextX) {
        newLists[lastX].tasks.splice(nextY, 0, newLists[lastX].tasks.splice(lastY, 1)[0]);
        apiHelper.put(`/api/tasks/${movedTask.id}`, {
          row_index: nextY,
        });
      } else {
        // move element to new place
        newLists[nextX].tasks.splice(nextY, 0, newLists[lastX].tasks[lastY]);
        // delete element from old place
        newLists[lastX].tasks.splice(lastY, 1);
        apiHelper.put(`/api/tasks/${movedTask.id}`, {
          row_index: nextY,
          column_id: newLists[nextX].id,
        });
      }
      return Object.assign({}, state, {
        lists: newLists,
      });
    }
    case TOGGLE_DRAGGING: {
      return state.set('isDragging', action.isDragging);
    }
    default:
      return state;
  }
}
