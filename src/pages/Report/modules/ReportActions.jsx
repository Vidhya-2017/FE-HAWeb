import clients from '../../../common/clients';

export const ReportActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    eventReport: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/reportListApi.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEventLocation: async () => {
        try {
          const response = await clients.eventLocation.get('');
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
    }
}