import clients from '../../../common/clients';
// main page

export const ForgotPasswordActions = {    
    getSecurityQues: async (data) => {
        try {
            const response = await clients.axiosAPI.post('fetchFPQuesByUserAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    validateSecurityQues: async (data) => {
        try {
            const response = await clients.axiosAPI.post('passwordValidationAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    changePassword: async (data) => {
        try {
            const response = await clients.axiosAPI.post('updatePasswordAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}

