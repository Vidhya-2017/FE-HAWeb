import clients from '../../../../common/clients';


export const PostAssessmentFeedbackAction = {

      postAssessmentFeedback: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/post_assessmentFeedback-add.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      }, 
      getAssessmentList: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('/AssessmentTypesLists.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }, 
   

}
