import clients from '../../../common/clients';

export const DemandDBAction = {
    getDemandReport: async (data) => {
        try {
            const response = await clients.DSaxiosAPI.post('/reportApi.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}
