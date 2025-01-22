import './App.css';
import React, { useState, useCallback } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Divider, Box, Paper, Tooltip } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from "@mui/icons-material/Chat";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import MultipleScoreComparisonCharts from "./components/file/MultipleScoreComparisonCharts";
import Chatbox from "./components/chatbot/Chatbox";
import FileUpload from "./components/file/FileUpload";
import AboutPage from "./components/AboutPage";

function App() {
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);
    const [language, setLanguage] = useState('sk');
    const [darkMode, setDarkMode] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState('home');

    const handleFileListUpdate = useCallback(() => {
        setFileListRefreshTrigger(prev => !prev);
    }, []);
    const handleCsvCreated = useCallback(() => {
        setCsvRefreshTrigger(prev => !prev);
    }, []);
    const handleDarkModeToggle = () => {
        setDarkMode(prev => !prev);
    };
    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: { main: '#4caf50' },
            secondary: { main: '#1cb5e0' },
        },
    });

    const handleMenuItemClick = (page) => {
        setSelectedPage(page);
        setDrawerOpen(false);
    };


    const menuItems = [
        { key: 'home', text: language === 'en' ? 'Home' : 'Domov' },
        { key: 'about', text: language === 'en' ? 'About' : 'O aplikácii' }
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {language === 'en' ? "Operating Systems" : "Operačné Systémy"}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <Box sx={{ width: 250 }} role="presentation">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                        <IconButton onClick={toggleDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem button key={item.key} onClick={() => handleMenuItemClick(item.key)}>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            {language === 'en' ? "Settings" : "Nastavenia"}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2">
                                {language === 'en' ? "Dark Mode" : "Tmavý režim"}
                            </Typography>
                            <Tooltip title={darkMode
                                ? (language === 'en' ? 'Switch to light mode' : 'Prepnúť na svetlý režim')
                                : (language === 'en' ? 'Switch to dark mode' : 'Prepnúť na tmavý režim')}>
                                <IconButton onClick={handleDarkModeToggle} color="inherit">
                                    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                                {language === 'en' ? "Language" : "Jazyk"}
                            </Typography>
                            <Box>
                                <IconButton onClick={() => setLanguage('en')} color={language === 'en' ? 'primary' : 'default'}>
                                    🇬🇧
                                </IconButton>
                                <IconButton onClick={() => setLanguage('sk')} color={language === 'sk' ? 'primary' : 'default'}>
                                    🇸🇰
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

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
                {selectedPage === 'about' ? (
                    <AboutPage language={language} />
                ) : (
                    <>
                        <Paper elevation={4} sx={{ margin: 2, padding: 2, borderRadius: 2 }}>
                            <FileUpload onUploadSuccess={handleFileListUpdate} language={language} />
                        </Paper>

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
                            <Typography variant="h5" gutterBottom>
                                {language === 'en' ? "Comparison Charts" : "Porovnávacie grafy"}
                            </Typography>
                            <MultipleScoreComparisonCharts language={language} refreshTrigger={csvRefreshTrigger}/>
                        </div>

                        <div className="footer">
                            <Typography variant="body1">
                                © {new Date().getFullYear()} Miroslav Tvrdoň. {language === 'en' ? 'All rights reserved.' : 'Všetky práva vyhradené.'}
                            </Typography>
                        </div>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;