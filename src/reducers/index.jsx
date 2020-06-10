import { combineReducers } from "redux";
import { loginReducer } from '../pages/Login/modules/login.reducer';

export default combineReducers({
    loginReducer: loginReducer
});
