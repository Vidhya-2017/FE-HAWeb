import clients from '../../../common/clients';

export const AddRecruitersAction = {
  
    getRecruiter: async () => {
        try {
          const response = await clients.DSaxiosAPI.post('/ListRecruiter.php');
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      deleteRecruiter: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/DeleteRecruiter.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },
      editRecruiter: async (data) => {
        try {
          const response = await clients.DSaxiosAPI.post('/EditRecruiter.php', data);
          return (response.data);
        }
        catch (error) {
          return (error.response);
        }
      },  
      addRecruiter: async (data) => {
      try {
          const response = await clients.DSaxiosAPI.post('/AddRecruiter.php',data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  },
    
    
}