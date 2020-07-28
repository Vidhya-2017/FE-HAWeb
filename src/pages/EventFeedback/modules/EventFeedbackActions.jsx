import clients from '../../../common/clients';

export const EventFeedbackActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    geClientDetailsById: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/clientList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    clientFeedbackOnEvent: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/eventFeedback.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

}
