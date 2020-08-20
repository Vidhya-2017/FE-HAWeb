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
}