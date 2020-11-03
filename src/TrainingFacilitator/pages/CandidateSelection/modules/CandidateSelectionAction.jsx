import clients from '../../../../common/clients';

export const CandidateSelectionAction = {
  getTrainingList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/TrainingList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getCandidatesByTrainingList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/candidateTrainingList.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  insertCandidates: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/candidateSelectionInsert.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
}
