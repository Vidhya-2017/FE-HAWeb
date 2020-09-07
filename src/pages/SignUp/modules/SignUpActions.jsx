import clients from '../../../common/clients';


export const SignUpActions = {
    signUpDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/signup.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    secretQuestions: async () => {
        try {
            const response = await clients.axiosAPI.get('forgetPasswordQuestionsAPI.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

}

