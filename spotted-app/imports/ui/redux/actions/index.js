import { ADD_ARTICLE, CHANGE_LOCATION, PREVIOUS_PAGE } from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}
export function changeLocation(payload) {
  return { type: CHANGE_LOCATION, payload };
}
export function previousPage(payload) {
  return { type: PREVIOUS_PAGE, payload };
}
