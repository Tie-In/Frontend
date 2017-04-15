export const SET_LIST = 'SET_LIST';
export const MOVE_CARD = 'MOVE_CARD';
export const TOGGLE_DRAGGING = 'TOGGLE_DRAGGING';

export const setList = (lists) => {
  return {
    type: SET_LIST,
    lists,
  };
};

export const moveCard = (lastX, lastY, nextX, nextY) => {
  return {
    type: MOVE_CARD,
    lastX,
    lastY,
    nextX,
    nextY,
  };
};

export const toggleDragging = (isDragging) => {
  return {
    type: MOVE_LIST,
    isDragging,
  };
};
