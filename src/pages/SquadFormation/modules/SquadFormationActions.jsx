import clients from '../../../common/clients';

export const SquadFormationActions = {
    getSquadList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/squadList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getCandidateList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/candidatesList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getSquadCandidateList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/squadCandidatesList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addSquad: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/addSquad.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    squadCandidatesInsert: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/squadCandidatesInsert.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    editSquadImage: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/editSquadImg.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    checkIsOrganiser: async (data) => {
        try {
            const response = await clients.axiosAPI.post('panelCheckAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/RegEventList.php');
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
