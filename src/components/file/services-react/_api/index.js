import axios from "axios";

const gsAxios = axios.create({
    baseURL: 'https://api.mtvrdon.com/',
    // https://34.107.119.159:443
    // https://100.119.248.77:8445
});

export default gsAxios;