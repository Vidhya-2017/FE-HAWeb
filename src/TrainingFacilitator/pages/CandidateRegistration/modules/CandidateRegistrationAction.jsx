import clients from '../../../../common/clients';

export const CandidateRegistrationAction = {
  getTrainingList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/TrainingList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getLocationList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/ListLocation.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getLobList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/ListLOB.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getAccountList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/ListAccount.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },  
  insertCandidate: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/CandidateRegistration.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }, 
}
