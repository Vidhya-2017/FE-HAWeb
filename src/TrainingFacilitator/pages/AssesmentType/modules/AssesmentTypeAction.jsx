import clients from '../../../../common/clients';


export const AssesmentTypeAction = {
    // setAddAssesmentTypeList: (data) => {
    //     return async (dispatch) => {
    //       return clients.AddAssesmentTypeList.post('AssessmentTypesAdd.php', data).then(res =>{
    //         dispatch({
    //             type : actionTypes.ADD_ASSESSMENT_TYPE,
    //             payload : res.data
    //         });
    //     }
    //         ).catch(
    //           error => {
    //           return (error.response.data);   
    //         }
    //         );
    //       }
    //   },


    getAssessmentList: async () => {
      try {
          const response = await clients.TFAxiosAPI.post('/AssessmentTypesLists.php');
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  }, 

  DeleteAssesmentTypeList: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/AssessmentTypesDelete.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
  setAddAssesmentTypeList: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/AssessmentTypesAdd.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },

  EditAssesmentTypeList: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('/AssessmentTypesEdit.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
  },
    
    
}
