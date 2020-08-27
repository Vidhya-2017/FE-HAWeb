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
    getSearchResult: async (data) => {
        try {
            const response = await clients.DSaxiosAPI.post('/SearchListing.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    deleteCandidate: async (data) =>{
        try {
            const response = await clients.DSaxiosAPI.post('/CandidateDelete.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    changeCandidateInterviewStatus: async (data) =>{
        try {
            const response = await clients.DSaxiosAPI.post('/CandidateLevelFeedback.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }
}