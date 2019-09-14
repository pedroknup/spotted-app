import {
  ADD_ARTICLE,
  CHANGE_LOCATION,
  PREVIOUS_PAGE
} from "../constants/action-types";
import { PAGE_HOME } from "../constants/pages";
const initialState = {
  articles: [],
  currentLocation: {
    id: "home",
    page: "Spotted",
    backButton: null,
    hasActionButton: true,
    payload: null
  },
  history: [{...PAGE_HOME}]
};
function rootReducer(state = initialState, action) {
  if (action.type === ADD_ARTICLE) {
    return Object.assign({}, state, {
      articles: state.articles.concat(action.payload)
    });
  } else if (action.type === CHANGE_LOCATION) {
    let history = state.history;
    const matchIndex = history.findIndex(
      item => item.id === action.payload.id
    );
   
    if (matchIndex >= 0) {
      history.slice(0, matchIndex);
    } else {
      history.push(action.payload);
    }

    return Object.assign({}, state, {
      history,
      currentLocation: action.payload
    });
  } else if (action.type === PREVIOUS_PAGE) {
    let history = state.history;
    history.pop();
    const currentLocation = history.slice(-1)[0];
    return Object.assign({}, state, {
      currentLocation,
      history,
    });
  }
  return state;
}
export default rootReducer;
