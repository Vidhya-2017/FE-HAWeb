import clients from '../../../common/clients';

export const EventStatusActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getSummary: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/fbSummary.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}