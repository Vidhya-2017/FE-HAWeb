import clients from '../../../../common/clients';


export const AccountMasterAction = {


    getAccountMasterList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListAccount.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }

    },

    deleteAccountMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/DeleteAccount.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    addAccountMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/AddAccount.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    editAccountMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/EditAccount.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },


}
