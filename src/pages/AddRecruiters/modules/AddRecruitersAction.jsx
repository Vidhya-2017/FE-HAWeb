import clients from '../../../common/clients';

export const AddRecruitersAction = {
  addSPOC: async (data) => {
      try {
          const response = await clients.DSaxiosAPI.post('/AddRecruiter.php',data);
          return (response.data);
      }
      catch (error) {
          return (error.response);
      }
  },
    
    
}