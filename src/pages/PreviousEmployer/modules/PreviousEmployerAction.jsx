import clients from '../../../common/clients';

export const PreviousEmployerAction = {

  getPreviousEmployer: async () => {
    try {
      const response = await clients.DSaxiosAPI.post('/ListsCompany.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  deletePreviousEmployer: async (data) => {
    try {
      const response = await clients.DSaxiosAPI.post('/DeleteCompany.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editPreviousEmployer: async (data) => {
    try {
      const response = await clients.DSaxiosAPI.post('/EditCompany.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  addPreviousEmployer: async (data) => {
    try {
      const response = await clients.DSaxiosAPI.post('/AddCompany.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  }
}
