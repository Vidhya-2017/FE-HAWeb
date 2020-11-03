import clients from '../../../../common/clients';

export const SMEAssignAction = {
  getTrainingList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/TrainingList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getSMEBySearch: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/Smesearch.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  geSMEByTraining: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/SMEListByTraining.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  insertSME: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/AssignSme.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }, 
}
