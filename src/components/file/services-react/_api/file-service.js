import gsAxios from "./index";

export const fetchFiles = async () => {
    try {
        const response = await fetch('https://147.232.205.178:8443/list');
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load file list');
        }
    } catch (error) {
        throw new Error('Error fetching file list');
    }
};

export const fetchTxt = async () => {
    try {
        const response = await fetch('https://147.232.205.178:8443/text');
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load file list');
        }
    } catch (error) {
        throw new Error('Error fetching file list');
    }
};

export const fetchCsv = async () => {
    try {
        const response = await fetch('https://147.232.205.178:8443/generatedlist');
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load file list');
        }
    } catch (error) {
        throw new Error('Error fetching file list');
    }
};

export const fetchComparisonData = async (fileName) => {
    try {
        // Use the fileName as part of the request URL
        const url = `https://147.232.205.178:8443/compare-scores?fileName=${fileName}`;

        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`Failed to fetch comparison data for file: ${fileName}`);
        }
    } catch (error) {
        throw new Error(`Error fetching comparison data for file: ${fileName}`);
    }
};

export const fetchResult = question => gsAxios.get('/bot/chatGemini', { params: { question } });

export const fetchChatHistory = async () => {
    return gsAxios.get('/bot/historyGemini');
};

export const clearChatHistory = async () => {
    return gsAxios.post('/bot/clearHistoryGemini');
};