import clients from '../../../common/clients';

export const EventCoordinatorActions = {
    geClientDetailsById: async (data) => {
        try {
            const response = await clients.axiosAPI.post('clientList.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('RegEventList.php');
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getPanelList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('panelList.php',data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    registerPanel: async (data) => {
        try {
            const response = await clients.axiosAPI.post('addPanelDetails.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    getUserBySearch: async (data) => {
        try {
            const response = await clients.axiosAPI.post('userSearch.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
    checkIsOrganiser: async (data) => {
        try {
            const response = await clients.axiosAPI.post('panelCheckAPI.php', data);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    }
}
