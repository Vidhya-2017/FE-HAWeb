import * as actionTypes from "../../../common/actionTypes/login.actiontype";

export const initialState = {
      userDetails: {}
};


export const loginReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGIN_RES:
        return {
            ...state,
            userDetails: action.payload
        };
        default:
        return state;
    }
}