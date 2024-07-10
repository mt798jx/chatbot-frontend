import gsAxios from "./index";

//get api/id

export const fetchQuestion = id => gsAxios.get('/api/' + id);