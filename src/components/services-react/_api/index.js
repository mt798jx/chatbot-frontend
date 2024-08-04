import axios from "axios";

const gsAxios = axios.create({
    baseURL: 'https://147.232.205.178:8443/',
});

export default gsAxios;