import clients from '../../../../common/clients';


export const DurationMasterAction = {


    getDurationMasterList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListDurationMaster.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }

    },

      deleteDurationMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/DeleteDurationMaster.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      },
      addDurationMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/AddDurationMaster.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      },

      editDurationMasterList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/EditDurationMaster.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      },


}
