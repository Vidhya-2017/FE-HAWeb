import clients from '../../../../common/clients';


export const TrainingFeedbackAction = {

    getTrainingList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/TrainingList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getCandidateFeedbackList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/CandidateFeedbackList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      },
      getCandidateList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/candidateListByTraining.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
      getPreAssessmentList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/pre-assessmentFeedback-list.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
      getPostAssessmentList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/post-assessmentFeedback-list.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
      trainingRecomendations: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/recommendAdd.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
}
