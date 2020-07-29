import clients from '../../../common/clients';

// export const SquadFormation = {
// }

// import clients from '../../../common/clients';
// import { AppCenterAnalytics } from '@ionic-native/app-center-analytics';

export const SquadFormActions = {
    getSquadList: async (data) => {
        try {
            // AppCenterAnalytics.trackEvent('Squad List Service Request', { request: JSON.stringify(data) });
            const response = await clients.axiosAPI.post('squadList.php', data);
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Squad List Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    getCandidateList: async (data) => {
        try {
            // AppCenterAnalytics.trackEvent('Candidate List Service Request', { request: JSON.stringify(data) });
            const response = await clients.axiosAPI.post('candidatesList.php', data);
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Candidate List Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    getSquadCandidateList: async (data) => {
        try {
            const response = await clients.axiosAPI.post('squadCandidatesList.php', data);
            // AppCenterAnalytics.trackEvent('Squad Candidate List Service Response', { success: JSON.stringify(response.data.errCode) });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Squad Candidate List Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    addSquad: async (data) => {
        try {
            const response = await clients.axiosAPI.post('addSquad.php', data);
            // AppCenterAnalytics.trackEvent('Add/Edit Squad Service Response', { 
            //     success: response.data.errCode
            // });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Add/Edit Squad Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    squadCandidatesInsert: async (data) => {
        try {
            // AppCenterAnalytics.trackEvent('Squad Candidate Insert Service Request', { request: JSON.stringify(data) });
            const response = await clients.axiosAPI.post('squadCandidatesInsert.php', data);
            // AppCenterAnalytics.trackEvent('Squad Candidate Insert Service Response', { 
            //     success: response.data.errCode
            // });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Squad Candidate Insert Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    editSquadImage: async (data) => {
        try {
            const response = await clients.axiosAPI.post('editSquadImg.php', data);
            // AppCenterAnalytics.trackEvent('Add/Edit Squad Service Response', { 
            //     success: response.data.errCode
            // });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Add/Edit Squad Service Response', { error: JSON.stringify(error) });

            return (error.response);
        }
    },
    getEventList: async () => {
        try {
            const response = await clients.axiosAPI.get('RegEventList.php');
            // AppCenterAnalytics.trackEvent('Event List Service Response', { 
            //     success: response.data.errCode
            // });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Event List Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
    getEventByUser: async (data) => {
        try {
            // AppCenterAnalytics.trackEvent('Event Details Service Request', { request: JSON.stringify(data) });
            const response = await clients.axiosAPI.post('EventByUserNew.php', data);
            // AppCenterAnalytics.trackEvent('Event Details Service Response', { 
            //     success: response.data.errCode
            // });
            return (response.data);
        }
        catch (error) {
            // AppCenterAnalytics.trackEvent('Event Details Service Response', { error: JSON.stringify(error) });
            return (error.response);
        }
    },
}
