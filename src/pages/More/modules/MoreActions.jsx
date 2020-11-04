import clients from '../../../common/clients';

export const MoreActions = {
  // Client details
    getClient: async () => {
        try {
          const response = await clients.axiosAPI.post('/clientList.php');
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      deleteClient: async (data) => {
        try {
          const response = await clients.axiosAPI.post('/clientDelete.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      editClient: async (data) => {
        try {
          const response = await clients.axiosAPI.post('/clientEdit.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },  
      addClient: async (data) => {
      try {
          const response = await clients.axiosAPI.post('/clientRegister.php',data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  },

  // Location details
  getLocation: async () => {
    try {
      const response = await clients.axiosAPI.post('/locationList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deleteLocation: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/deleteLocation.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editLocation: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/editLocation.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },  
  addLocation: async (data) => {
    try {
        const response = await clients.axiosAPI.post('/addLocation.php',data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
},
  // Skill details

  getSkill: async () => {
    try {
      const response = await clients.axiosAPI.post('/skillList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deleteSkill: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/deleteSkill.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editSkill: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/editSkill.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },  
  addSkill: async (data) => {
    try {
        const response = await clients.axiosAPI.post('/addSkill.php',data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
},

  // Competancy details

  getCompetancy: async () => {
    try {
      const response = await clients.axiosAPI.post('/competancyList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deleteCompetancy: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/deleteCompetancyLevel.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editCompetancy: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/editCompetancyLevel.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },  
  addCompetancy: async (data) => {
    try {
        const response = await clients.axiosAPI.post('/addCompetancyLevel.php',data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
},
  //  Assessment details
    
  getAssessment: async () => {
    try {
      const response = await clients.axiosAPI.post('/OtherAssessList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deleteAssessment: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/deleteOtherAssessment.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editAssessment: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/editOtherAssessment.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },  
  addAssessment: async (data) => {
    try {
        const response = await clients.axiosAPI.post('/addOtherAssessment.php',data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
},  


}