import clients from '../../../common/clients';

export const CandidateSelectionActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    checkIsOrganiser: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/panelCheckAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    bulkCandidateList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/bulkCandidateList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}