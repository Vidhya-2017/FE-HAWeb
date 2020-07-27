import clients from '../../../common/clients';

export const CandidateUploadActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    importExcel: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/import-excel/candidateRegisterImportApi.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEventByUser: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/EventByUserNew.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}