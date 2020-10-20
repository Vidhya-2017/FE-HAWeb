import clients from '../../../../common/clients';


export const TrainingListAction = {
    getTrainingList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/TrainingListAll.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }, 
  
    DeleteTrainingList: async (data) => {
      try {
          const response = await clients.TFAxiosAPI.post('/DeleteTrainingList.php', data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
    },
      
    EditTrainingList: async (data) => {
      try {
          const response = await clients.TFAxiosAPI.post('/EditTrainingList.php', data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
    },
    getSkillList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListSkillsList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getLocation: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListLocation.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    getAccount: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListAccount.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getTrainingType: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListTrainingType.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
     getSMEList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListSmelist.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    
    
}
