import clients from '../../../common/clients';

export const PanelAction = {
    getPanel: async () => {
        try {
          const response = await clients.DSaxiosAPI.get('/ListPanel.php');
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      deletePanel: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/DeletePanel.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      editPanel: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/EditPanel.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },  
      addPanel: async (data) => {
      try {
          const response = await clients.DSaxiosAPI.post('/AddPanel.php',data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  },
    
  getSkills: async (data) => {
    try {
        const response = await clients.DSaxiosAPI.post('/ListSkills.php',data);
        return (response.data);
    }
    catch (error) {
        return (error.response);
    }
}, 
}