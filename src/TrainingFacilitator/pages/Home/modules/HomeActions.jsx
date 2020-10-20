import clients from '../../../../common/clients';

export const HomeActions = {
  importExcel: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/importCandidates.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  /*  importExcel: (data) => {
       return async (dispatch) => {
         return clients.TFAxiosAPI.post('importCandidates.php', data).then(res =>{
           dispatch({
               type : actionTypes.IMPORT_EXCEL,
               payload : res.data
           });
       }
           ).catch(
             error => {
             return (error.response.data);   
           } 
           );
         }
     }, */
  getTrainingList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/TrainingList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  insertCandidates: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/CandidateUpload.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getAllTrainingList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/TrainingListAll.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getSkillList: async () => {
    try {
      const response = await clients.TFAxiosAPI.get('/ListSkillsList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  insertCurriculum: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/CurriculumUpload.php',data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }
}