import { actionTypes } from "./type";

//? ACTIONS
export const setMapPosition = (position) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_MAP_POSITION,
    position,
  });
};

export const setCompany = (company) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_COMPANY,
    company,
  });
};

export const setType = (types) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_TYPE,
    types,
  });
};

export const setProject = (project) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_PROJECT,
    project,
  });
};

export const setFormAddress_Map = (form_address_map) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_FORM_ADDRESS_MAP,
    form_address_map,
  });
};

export const setAlert = (alert) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_ALERT,
    alert,
  });
};

export const setImportReside = (importReside) => (dispatch) => {
  return dispatch({
    type: actionTypes.SET_IMPORT_RESIDE,
    importReside,
  });
};