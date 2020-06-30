import axios from 'axios';
import Interceptors from './Interceptors';

axios.defaults.timeout = 2500 * 10;

// const HOSTNAME = 'http://proctor.eastus.cloudapp.azure.com';
const HOSTNAME = 'https://apk.cnc.hclets.com';
const HACKERANCHOR = '/hackeranchor';
const IMPORTEXCEL = '/import-excel';

const eventListClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/RegEventList.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const importExcelClient = axios.create({
    baseURL: `${HOSTNAME}${IMPORTEXCEL}/candidateRegisterImportApi.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

const eventReportClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/reportListApi.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const eventReportWebClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/reportListWeb.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const feedbackSummaryClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/fbSummary.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const squadEventReportClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/squadReportApi.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const squadListClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/squadList.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const loginAuthClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/login.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});

const panelFeedbackClient = axios.create({
    baseURL: `${HOSTNAME}${HACKERANCHOR}/eventFeedbackReport.php`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
    }
});
const clients = {
    eventList: eventListClient,
    importExcel: importExcelClient,
    eventReport: eventReportClient,
    eventReportWeb: eventReportWebClient,
    feedbackSummary: feedbackSummaryClient,
    squadEventReport: squadEventReportClient,
    squadList: squadListClient,
    loginAuth: loginAuthClient,
    panelFeedback: panelFeedbackClient
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
interceptors.addRequestInterceptors(panelFeedbackClient);
interceptors.addResponseInterceptors(panelFeedbackClient);
interceptors.addRequestInterceptors(loginAuthClient);
interceptors.addResponseInterceptors(loginAuthClient);
export default clients;