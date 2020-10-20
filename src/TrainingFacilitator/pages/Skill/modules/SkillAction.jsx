import clients from '../../../../common/clients';

export const SkillAction = {
  getSkillList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('ListSkillsList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deleteSkillList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/DeleteSkillsList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  addSkillList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/AddSkillsList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },

  editSkillList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/EditSkillsList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  addCurriculum: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/AddCurriculum.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getCurriculumList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/ListCurriculum.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editCurriculum: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/EditCurriculum.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  delCurriculum: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/DeleteCurriculum.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  multidelCurriculum: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/MultiDeleteCurriculum.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }
}
