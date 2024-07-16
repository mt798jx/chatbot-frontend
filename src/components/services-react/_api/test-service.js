import gsAxios from "./index";

export const fetchQuestion = id => gsAxios.get('/api/' + id);
export const fetchResult = (id, answer) => gsAxios.get('/bot/result/' + id + '/' + answer);