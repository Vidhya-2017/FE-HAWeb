import clients from '../../../../common/clients';


export const PreAssessmentFeedbackAction = {

      insertPreAssessmentFeedback: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/pre-assessmentFeedback-add.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
   
      
}
