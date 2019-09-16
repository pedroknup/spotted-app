import {
  ADD_ARTICLE,
  CHANGE_LOCATION,
  PREVIOUS_PAGE,
  CHANGE_DEVICE,
  CHANGE_UNIQUE_ID,
  VERIFY,
  CHANGE_COORDINATES,
  CHANGE_SELECTED_SPOTTED
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}
export function changeLocation(payload) {
  return { type: CHANGE_LOCATION, payload };
}
export function previousPage(payload) {
  return { type: PREVIOUS_PAGE, payload };
}
export function changeDevice(payload) {
  return { type: CHANGE_DEVICE, payload };
}
export function changeUniqueId(payload) {
  return { type: CHANGE_UNIQUE_ID, payload };
}
export function changeCoordinates(payload) {
  return { type: CHANGE_COORDINATES, payload };
}
export function changeSelectedSpotted(payload) {
  return { type: CHANGE_SELECTED_SPOTTED, payload };
}
export function verify() {
  return { type: VERIFY };
}
