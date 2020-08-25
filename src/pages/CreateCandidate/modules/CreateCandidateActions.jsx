import clients from '../../../common/clients';

export const CreateCandidateActions = {
    createCandidateForm: async (data) => {
        try {
            const response = await clients.DSaxiosAPI.post('/CandidateRegistration.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getPrimarySkillsReport: async () => {
        try {
            const response = await clients.DSaxiosAPI.get('/ListSkills.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getListLocation: async () => {
        try {
            const response = await clients.DSaxiosAPI.get('/ListLocation.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getListRecruiter: async () => {
        try {
            const response = await clients.DSaxiosAPI.get('/ListRecruiter.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getListSource: async () => {
        try {
            const response = await clients.DSaxiosAPI.get('/ListSource.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getListSpoc: async () => {
        try {
            const response = await clients.DSaxiosAPI.get('/ListSpoc.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}