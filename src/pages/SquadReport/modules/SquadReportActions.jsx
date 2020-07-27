import clients from '../../../common/clients';

export const SquadReportActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    squadEventReport: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/squadReportApi.php', data);
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