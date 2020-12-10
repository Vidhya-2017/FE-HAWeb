import clients from '../../../common/clients';

export const CandidateFeedbackActions = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
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
    squadCandidateList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('candidateBySquadList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEventDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('EventByUserNew.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    candidateFB: async (data) => {
        try {           
            const response = await clients.axiosAPI.post('squadFeedback.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    
    candidateFeedbackList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('clientFeedbackLists.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    candidateSquadFeedbackList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('multiple-squadFeedbackList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    candidateSquadWiseFeedback: async (data) => {
        try {
            const response = await clients.axiosAPI.post('multiple-squadFeedback.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
} 