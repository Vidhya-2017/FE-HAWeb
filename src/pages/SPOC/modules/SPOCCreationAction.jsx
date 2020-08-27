import clients from '../../../common/clients';

export const SPOCCreationAction = {
    getSPOC: async () => {
        try {
          const response = await clients.DSaxiosAPI.post('/ListSpoc.php');
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      deleteSPOC: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/DeleteSpoc.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      editSPOC: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/EditSpoc.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },  
      addSPOC: async (data) => {
      try {
          const response = await clients.DSaxiosAPI.post('/AddSpoc.php',data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  },
    
    
}