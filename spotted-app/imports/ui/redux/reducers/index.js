import {
  ADD_ARTICLE,
  CHANGE_LOCATION,
  PREVIOUS_PAGE,
  CHANGE_DEVICE,
  CHANGE_UNIQUE_ID,
  VERIFY,
  CHANGE_COORDINATES
} from "../constants/action-types";

import { PAGE_HOME } from "../constants/pages";
const initialState = {
  uniqueId: "",
  coordinates: null,
  device: null
};
function rootReducer(state = initialState, action) {
  if (action.type === CHANGE_DEVICE) {
    const newState = Object.assign({}, state, {
      device: action.payload
    });
    localStorage.setItem("reducer", JSON.stringify(newState));
    return newState;
  } else if (action.type === VERIFY) {
    const persistentStateJson = localStorage.getItem("reducer");

    try {
      const persistentState = JSON.parse(persistentStateJson);

      Object.assign({}, state, {
        ...persistentState
      });
      return state;
    } catch (e) {
      state;
    }
  } else if (action.type === CHANGE_COORDINATES) {
    // alert("changing coords")
    const newState = Object.assign({}, state, {
      coordinates: action.payload
    });
    localStorage.setItem("reducer", JSON.stringify(newState));
    return newState;
  } else if (action.type === CHANGE_UNIQUE_ID) {
    const newState = Object.assign({}, state, {
      uniqueId: action.payload
    });
    localStorage.setItem("reducer", JSON.stringify(newState));
    return newState;
  }
  return state;
}
export default rootReducer;
