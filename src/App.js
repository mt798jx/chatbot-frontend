import './App.css';
import { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography, useMediaQuery, IconButton, Tooltip } from "@mui/material";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import GeneratedList from "./components/file/GeneratedList";
import FlagSwitcher from "./components/file/FlagSwitcher";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MultipleScoreComparisonCharts from "./components/file/MultipleScoreComparisonCharts";

function App() {
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);
    const [language, setLanguage] = useState('sk');
    const [darkMode, setDarkMode] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleProcessingComplete = useCallback(() => {
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

    const tooltipTitle = language === 'en'
        ? (darkMode ? 'Dark mode' : 'Light mode')
        : (darkMode ? 'Tmavý režim' : 'Svetlý režim');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box className="App" data-theme={darkMode ? 'dark' : 'light'}>
                <Typography variant={isSmallScreen ? "h4" : "h3"} sx={{fontWeight: 'regular'}} gutterBottom className="header">
                    {language === 'en' ? "Operating Systems" : "Operačné Systémy"}
                </Typography>
                <FlagSwitcher language={language} setLanguage={setLanguage}/>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                    <Tooltip title={tooltipTitle}>
                        <IconButton onClick={handleDarkModeToggle} color="inherit">
                            {darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                        </IconButton>
                    </Tooltip>
                </Box>

                <div className="content">
                    <FileList onProcessingComplete={handleProcessingComplete} onCsvCreated={handleCsvCreated}
                              language={language}/>
                    <TxtList refreshTrigger={fileListRefreshTrigger} onCsvCreated={handleCsvCreated}
                             language={language}/>
                    <GeneratedList refreshTrigger={csvRefreshTrigger} language={language}/>
                </div>

                <div className="graph-container">
                    <Typography variant="h5" sx={{mb: 3}}>
                        {language === 'en' ? "Comparison Charts for CSV Files" : "Porovnávacie grafy pre súbory CSV"}
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