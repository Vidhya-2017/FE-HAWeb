import clients from '../../../common/clients';

export const SPOCCreationAction = {
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