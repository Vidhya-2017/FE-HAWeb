import clients from '../../../../common/clients';

export const SMEAction = {
  getSMEList: async () => {
    try {
      const response = await clients.TFAxiosAPI.post('/UserList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }, getSkillList: async (data) => {
    try {
        const response = await clients.TFAxiosAPI.post('ListSkillsList.php', data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
}, getRoleList: async (data) =>{
   try {
      const response = await clients.TFAxiosAPI.post('roleList.php', data);
      return (response.data); 
   }
   catch (error) {
      return (error.response);
   }
},
  deleteSMEList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/deleteUser.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editSMEList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/editUser.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
addSMEList: async (data) => {
    try {
      const response = await clients.TFAxiosAPI.post('/insertUser.php ', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }

    
    
}
