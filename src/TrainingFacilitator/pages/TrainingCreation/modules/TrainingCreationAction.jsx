import clients from '../../../../common/clients';

export const TrainingCreationAction = {
    getSkillList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListSkillsList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getLocation: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListLocation.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
	getProgramManager: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/programManagerList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    getAccount: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/ListAccount.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    registerTraining: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/AddTrainingList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getTrainingList: async () => {
        try {
            const response = await clients.TFAxiosAPI.get('TrainingListAll.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getBatchList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('BatchMasterList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getMentorList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('mentorList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getTrainingType: async () => {
        try {
            const response = await clients.TFAxiosAPI.post('ListTrainingType.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },

    addBatchName: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('BatchMasterAdd.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    insertCandidate: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('CandidateRegistration.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getLobList: async () => {
        try {
            const response = await clients.TFAxiosAPI.get('ListLOB.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getCandidateMapList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('BatchMapCandidateList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    insertCandidateBatchMap: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('CandidateBatchMapAdd.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getSmeList: async () => {
        try {
            const response = await clients.TFAxiosAPI.get('/ListSmelist.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getTopicList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/TrainingBasedCurriculum.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    submitCurriculum: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/AddTrainingSkillCurriculumMapping.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEditTrainingData: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/TrainingDetails.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    EditTrainingList: async (data) => {
        try {
            const response = await clients.TFAxiosAPI.post('/EditTrainingList.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
      },
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
    getSmeCoveredList: async (data) => {
      try {
          const response = await clients.TFAxiosAPI.post('/SMECoveredList.php', data);
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
