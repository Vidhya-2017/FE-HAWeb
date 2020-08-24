import clients from '../../../common/clients';

export const EventListAction = {
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('/AllEventList.php');
            console.log(response);
            return (response.data);
        }
        catch (error) {
            return (error.response);
        }
    },
}
