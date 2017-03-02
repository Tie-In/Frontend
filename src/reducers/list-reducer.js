import { Record } from 'immutable';

import {
  SET_LIST,
  MOVE_CARD,
  MOVE_LIST,
  TOGGLE_DRAGGING,
} from '../actions/list-actions';

/* eslint-disable new-cap */
const initialState = {
  lists: [],
  isDragging: false,
};
/* eslint-enable new-cap */
//const initialState = new InitialState;


export default function lists(state = initialState, action) {
  switch (action.type) {
    case SET_LIST:
      console.log(action.lists);
      return Object.assign({}, state, {
        lists: action.lists,
      });
    case MOVE_CARD: {
      const newLists = [...state.lists];
      const { lastX, lastY, nextX, nextY } = action;
      if (lastX === nextX) {
        newLists[lastX].cards.splice(nextY, 0, newLists[lastX].cards.splice(lastY, 1)[0]);
      } else {
        // move element to new place
        newLists[nextX].cards.splice(nextY, 0, newLists[lastX].cards[lastY]);
        // delete element from old place
        newLists[lastX].cards.splice(lastY, 1);
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
