import axios from 'axios';

const eventListClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/hackeranchor/RegEventList.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

const importExcelClient = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/import-excel/candidate_import_api.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

const clients = {
    eventList: eventListClient,
    importExcel: importExcelClient
}

export default clients;