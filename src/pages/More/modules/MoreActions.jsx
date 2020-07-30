import clients from '../../../common/clients';

export const MoreActions = {
    addClientDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/clientRegister.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addSkillDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/addSkill.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addLocationDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/addLocation.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addCompetancyDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/addCompetancyLevel.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addAssessmentDetails: async (data) => {
        try {
            const response = await clients.axiosAPI.post('/addOtherAssessment.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}