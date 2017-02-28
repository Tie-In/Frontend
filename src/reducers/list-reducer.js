import {
  SET_LIST,
  MOVE_CARD,
  MOVE_LIST,
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
      const { lastX, lastY, nextX, nextY } = action;
      if (lastX === nextX) {
        newLists[lastX].tasks.splice(nextY, 0, newLists[lastX].tasks.splice(lastY, 1)[0]);
      } else {
        // move element to new place
        newLists[nextX].tasks.splice(nextY, 0, newLists[lastX].tasks[lastY]);
        // delete element from old place
        newLists[lastX].tasks.splice(lastY, 1);
      }
      return Object.assign({}, state, {
        lists: newLists,
      });
    }
    case MOVE_LIST: {
      const newLists = [...state.lists];
      const { lastX, nextX } = action;
      const t = newLists.splice(lastX, 1)[0];

      newLists.splice(nextX, 0, t);
      apiHelper.put(`/api/statuses/${t.id}`, {
        column_index: nextX,
      });
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
