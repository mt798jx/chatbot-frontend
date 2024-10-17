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

export const fetchComparisonData = async () => {
    try {
        // Replace this with your hardcoded test URL or mock data for testing
        const url = `https://147.232.205.178:8443/compare-scores`;  // Simplified to use without any fileName

        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch comparison data');
        }
    } catch (error) {
        throw new Error('Error fetching comparison data');
    }
};