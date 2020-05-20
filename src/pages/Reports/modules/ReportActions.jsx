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
    importExcel: async (data) => {
        try {
            const response = await clients.importExcel.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}