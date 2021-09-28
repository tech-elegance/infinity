import { actionTypes } from "../action/type";

const initial = {
  position: "", //* ตำแหน่งจากการคลิก alert มาเปลี่ยนพิกัด
  company: {},
  types: {},
  project: {},
  alert: {}, //* เก็บค่า alert จากกระดิ่ง
  form_address_map: {}, //* เก็บค่าจาก motion ไป form หน้า Address
  importReside: [],
};

//? REDUCERS
export const reducer = (state = initial, action) => {
  switch (action.type) {
    case actionTypes.SET_MAP_POSITION:
      return Object.assign({}, state, { position: action.position });
    case actionTypes.SET_COMPANY:
      return Object.assign({}, state, { company: action.company });
    case actionTypes.SET_TYPE:
      return Object.assign({}, state, { types: action.types });
    case actionTypes.SET_PROJECT:
      return Object.assign({}, state, { project: action.project });
    case actionTypes.SET_ALERT:
      return Object.assign({}, state, { alert: action.alert });
    case actionTypes.SET_FORM_ADDRESS_MAP:
      return Object.assign({}, state, {
        form_address_map: action.form_address_map,
      });
    case actionTypes.SET_IMPORT_RESIDE:
      return Object.assign({}, state, { importReside: action.importReside });
    default:
      return state;
  }
};
