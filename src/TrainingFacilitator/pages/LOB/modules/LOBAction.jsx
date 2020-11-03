import clients from '../../../../common/clients';

export const LOBAction = {
    getLOBList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListLOB.php');
            return response.data;
        }
        catch (error) {
            return (error.response);
        }
    },

    addLOB: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/AddLOB.php', data);
            return response.data;
        }
        catch (error) {
            return (error.response)
        }
    },

    editLOB: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/EditLOB.php', data);
            return response.data;
        }
        catch (error) {
            return (error.response)
        }
    },

    deleteLOB: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/DeleteLOB.php', data);
            return response.data;
        }
        catch (error) {
            return (error.response)
        }
    }
}