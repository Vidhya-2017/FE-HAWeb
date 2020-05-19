import axios from 'axios';



const AddSMEList = axios.create({
    baseURL: 'http://proctor.eastus.cloudapp.azure.com/training-facilitator/AddSmeList.php',
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
    }
});

const clients = {
    AddSMEList: AddSMEList,
}

export default clients;