import clients from '../../../common/clients';

export const CandidateUploadActions = {
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
    getEventByUser: async (data) => {
        try {
            const response = await clients.eventByUser.post('', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}