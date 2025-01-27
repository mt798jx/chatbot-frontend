import gsAxios from "./index";

// https://100.119.248.77:8445

export const fetchFiles = async () => {
    try {
        const response = await fetch('https://34.107.119.159:443/list');
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
        const response = await fetch('https://34.107.119.159:443/text');
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
        const response = await fetch('https://34.107.119.159:443/generatedlist');
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
        const url = `https://https://34.107.119.159:443/compare-scores?fileName=${fileName}`;

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


export const fetchResult = question => gsAxios.get('/chatGemini', { params: { question } });

export const fetchChatHistory = async () => {
    return gsAxios.get('/historyGemini');
};

export const clearChatHistory = async () => {
    return gsAxios.post('/clearHistoryGemini');
};

/*
export const fetchResult = question => gsAxios.get('/chatChatGPT', { params: { question } });

export const fetchChatHistory = async () => {
    return gsAxios.get('/historyChatGPT');
};

export const clearChatHistory = async () => {
    return gsAxios.post('/clearHistoryChatGPT');
};
*/