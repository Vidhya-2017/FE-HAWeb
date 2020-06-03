import clients from '../../../common/clients';

export const DashboardActions = {
    getEventList: async () => {
        try {
            const response = await clients.eventList.get('');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    feedbackSummary: async (data) => {
        try {
            const response = await clients.feedbackSummary.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }
}