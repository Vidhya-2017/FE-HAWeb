import clients from '../../../common/clients';

export const SquadReportActions = {
    getEventList: async () => {
        try {
            const response = await clients.eventList.get('');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    squadEventReport: async (data) => {
        try {
            const response = await clients.squadEventReport.post('', data);
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
            const response = await clients.eventReportWeb.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }
}