import gsAxios from "./index";

export const fetchResult = (question) => gsAxios.get('/chat', { params: { question } });
