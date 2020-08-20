import axios from 'axios';
import Interceptors from './Interceptors';

axios.defaults.timeout = 2500 * 10;

const HOSTNAME = 'http://proctor.eastus.cloudapp.azure.com';
// const HOSTNAME = 'https://apk.cnc.hclets.com';

const HACKERANCHOR = '/hackeranchor';
const DEMANDSUPPLY = '/demand-supply';

const axiosAPI = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const DSaxiosAPI = axios.create({
    baseURL: `${HOSTNAME}${DEMANDSUPPLY}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const clients = {
    axiosAPI,
    DSaxiosAPI
};

const interceptors = new Interceptors();
interceptors.addRequestInterceptors(axiosAPI);
interceptors.addResponseInterceptors(axiosAPI);

interceptors.addRequestInterceptors(DSaxiosAPI);
interceptors.addResponseInterceptors(DSaxiosAPI);
export default clients;