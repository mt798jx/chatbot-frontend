import './App.css';
import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, useMediaQuery } from "@mui/material";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import MultipleScoreComparisonCharts from "./components/file/MultipleScoreComparisonCharts";
import Chatbox from "./components/chatbot/Chatbox";
import ChatIcon from "@mui/icons-material/Chat";
import FileUpload from "./components/file/FileUpload";
import HeaderSection from "./components/file/HeaderSection";

function App() {
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);
    const [language, setLanguage] = useState('sk');
    const [darkMode, setDarkMode] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [showChat, setShowChat] = useState(false);

    const handleFileListUpdate = useCallback(() => {
        setFileListRefreshTrigger(prev => !prev);
    }, []);

    const handleCsvCreated = useCallback(() => {
        setCsvRefreshTrigger(prev => !prev);
    }, []);

    const handleDarkModeToggle = () => {
        setDarkMode(prev => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {showChat ? (
                <div className="content">
                    <Chatbox toggleChatVisibility={toggleChatVisibility}/>
                </div>
            ) : (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    <ChatIcon />
                </button>
            )}
            <Box className="App" data-theme={darkMode ? 'dark' : 'light'}>

                <HeaderSection
                    language={language}
                    setLanguage={setLanguage}
                    darkMode={darkMode}
                    toggleDarkMode={handleDarkModeToggle}
                />

                <FileUpload onUploadSuccess={handleFileListUpdate} language={language} />

                <div className="content">
                    <FileList
                        refreshTrigger={fileListRefreshTrigger}
                        onProcessingComplete={handleFileListUpdate}
                        onFileDeleted={handleFileListUpdate}
                        language={language}
                        onCsvCreated={handleCsvCreated}
                    />
                    <TxtList
                        refreshTrigger={fileListRefreshTrigger}
                        onCsvCreated={handleCsvCreated}
                        language={language}
                    />
                </div>

                <div className="graph-container">
                    <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                        {language === 'en' ? "Comparison Charts" : "Porovnávacie grafy"}
                    </Typography>
                    <MultipleScoreComparisonCharts language={language} refreshTrigger={csvRefreshTrigger}/>
                </div>

                <div className="footer">
                    <Typography variant={isSmallScreen ? "body2" : "body1"}>
                        © {new Date().getFullYear()} Miroslav
                        Tvrdoň. {language === 'en' ? 'All rights reserved.' : 'Všetky práva vyhradené.'}
                    </Typography>
                </div>
            </Box>
        </ThemeProvider>
    );
}

export default App;