import clients from '../../../common/clients';

export const DashboardActions = {
    
    getCandidateReport: async (data) => {
        try {
            const response = await clients.DSaxiosAPI.post('/CandidateListing.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}