import axios from "axios";

const gsAxios = axios.create({
    baseURL: 'https://100.119.248.77:8445/',
});

export default gsAxios;