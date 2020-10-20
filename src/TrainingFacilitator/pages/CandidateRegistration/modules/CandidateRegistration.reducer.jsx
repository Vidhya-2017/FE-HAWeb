import * as actionTypes from "../../../common/actionTypes/CandidateRegistration.actiontype";

export const initialState = {
      BatchMasterList : [],
};


export const CandidateRegistrationReducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_BATCH:
        return {
            ...state,
            BatchMasterList : action.payload,
        };
        default:
        return state;
    }
}