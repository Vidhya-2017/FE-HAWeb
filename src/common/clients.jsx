import axios from 'axios';
import Interceptors from './Interceptors';

axios.defaults.timeout = 2500 * 10;

const HOSTNAME = 'http://proctor.eastus.cloudapp.azure.com';
// const HOSTNAME = 'https://apk.cnc.hclets.com';

const HACKERANCHOR = '/hackeranchor';

const axiosAPI = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const clients = {
    axiosAPI
};

const interceptors = new Interceptors();
interceptors.addRequestInterceptors(axiosAPI);
interceptors.addResponseInterceptors(axiosAPI);
export default clients;