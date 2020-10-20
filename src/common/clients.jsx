import axios from 'axios';
import Interceptors from './Interceptors';

axios.defaults.timeout = 2500 * 10;

const HOSTNAME = 'http://proctor.eastus.cloudapp.azure.com';
// const HOSTNAME = 'https://apk.cnc.hclets.com';

const HACKERANCHOR = '/hackeranchor';
const DEMANDSUPPLY = '/demand-supply';
const TRAININGFACILITATOR = '/TrainingFacilitator/';

const TFAxiosAPI = axios.create({
    baseURL: `${HOSTNAME}${TRAININGFACILITATOR}`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});


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
    DSaxiosAPI,
    TFAxiosAPI
};

const interceptors = new Interceptors();
interceptors.addRequestInterceptors(axiosAPI);
interceptors.addResponseInterceptors(axiosAPI);

interceptors.addRequestInterceptors(DSaxiosAPI);
interceptors.addResponseInterceptors(DSaxiosAPI);

interceptors.addRequestInterceptors(TFAxiosAPI);
interceptors.addResponseInterceptors(TFAxiosAPI);
export default clients;