import gsAxios from "./index";

export const fetchQuestionAndAnswer = id => gsAxios.get('/api/' + id);
export const fetchResult = (id, answer) => gsAxios.get('/bot/result/' + id + '/' + answer);