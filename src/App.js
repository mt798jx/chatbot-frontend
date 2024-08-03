import './App.css';
import { useState, useCallback } from "react";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import GeneratedList from "./components/file/GeneratedList";
import Typography from '@mui/material/Typography';
import { useMediaQuery } from "@mui/material";
import './components/file/_universal_style/File.css';
import FlagSwitcher from "./components/file/FlagSwitcher";

function App() {
    {/*const [showChat, setShowChat] = useState(false);*/}
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);
    const [language, setLanguage] = useState('sk');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    {/*
    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };
    */}

    const handleProcessingComplete = useCallback(() => {
        setFileListRefreshTrigger(prev => !prev);
    }, []);

    const handleCsvCreated = useCallback(() => {
        setCsvRefreshTrigger(prev => !prev);
    }, []);

    return (
        <div className="App">
            <Typography variant={isSmallScreen ? "h4" : "h3"} sx={{ fontWeight: 'regular' }} gutterBottom className="header">
                {language === 'en' ? "Operating Systems" : "Operačné Systémy"}
            </Typography>
            <FlagSwitcher language={language} setLanguage={setLanguage} />
            <div className="content">
                <FileList onProcessingComplete={handleProcessingComplete} refreshTrigger={fileListRefreshTrigger}
                          onCsvCreated={handleCsvCreated} language={language} />
                <TxtList refreshTrigger={csvRefreshTrigger} onCsvCreated={handleCsvCreated} language={language} />
                <GeneratedList refreshTrigger={csvRefreshTrigger} language={language} />
            </div>

            {/*
            <div className="content">
                <Test/>
            <div/>
            {showChat ? (
                <div className="content">
                    <Chatbox toggleChatVisibility={toggleChatVisibility}/>
                </div>
            ) : (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    💭
                </button>
            )}
            */}

            <div className="footer">
                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                    © {new Date().getFullYear()} Miroslav Tvrdoň. {language === 'en' ? 'All rights reserved.' : 'Všetky práva vyhradené.'}
                </Typography>
            </div>
        </div>
    );
}

export default App;