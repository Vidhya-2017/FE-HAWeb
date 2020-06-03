import axios from 'axios';
import Interceptors from './Interceptors';

const eventListClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/RegEventList.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

const importExcelClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/import-excel/candidateRegisterImportApi.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

const eventReportClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/reportListApi.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'text/plain'}
});

const eventReportWebClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/reportListWeb.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'text/plain'}
});

const feedbackSummaryClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/fbSummary.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'text/plain'}
});

const squadEventReportClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/squadReportApi.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'text/plain'}
});

const squadListClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/squadList.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'text/plain'
    }
});
const clients = {
    eventList: eventListClient,
    importExcel: importExcelClient,
    eventReport: eventReportClient,
    eventReportWeb: eventReportWebClient,
    feedbackSummary: feedbackSummaryClient,
    squadEventReport: squadEventReportClient,
    squadList: squadListClient
}
const interceptors = new Interceptors();
interceptors.addRequestInterceptors(eventListClient);
interceptors.addResponseInterceptors(eventListClient);
interceptors.addRequestInterceptors(importExcelClient);
interceptors.addResponseInterceptors(importExcelClient);
interceptors.addRequestInterceptors(eventReportClient);
interceptors.addResponseInterceptors(eventReportClient);
interceptors.addRequestInterceptors(eventReportWebClient);
interceptors.addResponseInterceptors(eventReportWebClient);
interceptors.addRequestInterceptors(feedbackSummaryClient);
interceptors.addResponseInterceptors(feedbackSummaryClient);
interceptors.addRequestInterceptors(squadEventReportClient);
interceptors.addResponseInterceptors(squadEventReportClient);
interceptors.addRequestInterceptors(squadListClient);
interceptors.addResponseInterceptors(squadListClient);
export default clients;