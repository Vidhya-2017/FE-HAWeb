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
    },
    eventReportWeb: async (data) => {
        try {
            const response = await clients.eventReportWeb.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getSquadList: async (data) => {
        try {
            const response = await clients.squadList.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    panelFeedbackReport: async (data) => {
        try {
            const response = await clients.panelFeedback.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}