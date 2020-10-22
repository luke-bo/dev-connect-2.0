import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch => {
  // create uuid
  const id = uuid.v4();
  // dispatch the alert 
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
};