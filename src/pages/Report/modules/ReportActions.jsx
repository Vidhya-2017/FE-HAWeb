import clients from '../../../common/clients';

export const ReportActions = {
    getEventList: async () => {
        try {
            const response = await clients.eventList.get('');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    eventReport: async (data) => {
        try {
            const response = await clients.eventReport.post('', data);
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