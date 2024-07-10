import axios from "axios";

const gsAxios = axios.create({
    //baseURL: 'http://localhost:8080/bot/',
    //baseURL: 'https://192.168.1.23:8443/bot/',
    baseURL: 'https://147.232.205.178:8443/bot/',
});

export default gsAxios;