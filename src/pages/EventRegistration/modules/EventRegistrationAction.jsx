import clients from '../../../common/clients';

export const EventRegistrationAction = {
  getEventList: async () => {
    try {
      const response = await clients.axiosAPI.get('/RegEventList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getEventByUser: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/EventByUserNew.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  getAdminBySearch: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/adminList.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  registerEvent: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/insertEventNew.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  editEvent: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/editEventNew.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  geClientDetailsList: async () => {
    try {
      const response = await clients.axiosAPI.get('/clientList.php');
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  addClientDetails: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/clientRegister.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
  closeEvent: async (data) => {
    try {
      const response = await clients.axiosAPI.post('/EventClosed.php', data);
      return (response.data);
    }
    catch (error) {
      return (error.response);
    }
  },
}

