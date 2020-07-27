import clients from '../../../common/clients';

export const DashboardActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    feedbackSummary: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/fbSummary.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    eventReportWeb: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/reportListWeb.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getSquadList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/squadList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    panelFeedbackReport: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/eventFeedbackReport.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}