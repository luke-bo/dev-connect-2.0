// this is our 'root reducer'

import { combineReducers } from 'redux';
import alert from './alert';

export default combineReducers({
  alert
});