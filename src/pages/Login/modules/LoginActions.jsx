import clients from '../../../common/clients';
import * as actionTypes from "../../../common/actionTypes/login.actiontype";

export const LoginActions = {
    loginAuth: (data) => {
        return async (dispatch) => {
            try {
                const response = await clients.loginAuth.post('', data);
                if (response.data && response.data.UserSet && response.data.UserSet.length > 0 &&
                    response.data.UserSet[0].isAdmin === "1") {
                    dispatch({
                        type: actionTypes.LOGIN_RES,
                        payload: response.data.UserSet[0]
                    });
                    return (response.data);
                } else {
                    dispatch({
                        type: actionTypes.LOGIN_RES,
                        payload: {}
                    });
                    return (response.data);
                }
            }
            catch (error) {
                return (error.response);
            }
        }

    }
}