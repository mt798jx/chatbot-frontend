import gsAxios from "./index";

export const fetchResult = question => gsAxios.get('/bot/chat', { params: { question } });
