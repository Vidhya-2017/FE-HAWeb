import clients from '../../../../common/clients';


export const SMECompletedTopicsAction = {
 
    getTrainingList: async () => {
      try {
          const response = await clients.TFAxiosAPI.post('/TrainingList.php');
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  }, 
  trainingListDetails: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/TrainingListDetails.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
  getCurriculumBySkill: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/CurriculumSearch.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
  insertCurriculamData: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/AddSmeCoveredTopic.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
    
}
