import clients from '../../../../common/clients';


export const TrainingTypeAction = {
 
    getTrainingTypeList: async () => {
      try {
          const response = await clients.TFAxiosAPI.post('/ListTrainingType.php');
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  }, 
  addTrainingType: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/AddTrainingType.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
  editTrainingType: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/EditTrainingType.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
    deleteTrainingType: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/DeleteTrainingType.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
    
}
