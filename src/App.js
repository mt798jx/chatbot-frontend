import './App.css';
import React, { useState, useCallback, useEffect, useRef } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText,
    Divider, Box, Tooltip, Fab, useMediaQuery
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from "@mui/icons-material/Chat";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomePage from './components/page/HomePage';
import AboutPage from "./components/page/AboutPage";
import ResultsPage from "./components/page/ResultsPage";
import Chatbox from "./components/chatbot/Chatbox";
import FlagSwitcher from "./components/FlagSwitcher";

import usePersistedState from './hooks/usePersistedState';

function App({ language, setLanguage, onLogout }) {
    // Persistent States
    const [selectedPage, setSelectedPage] = usePersistedState('selectedPage', 'home');
    const [darkMode, setDarkMode] = usePersistedState('darkMode', true);

    // Non-persistent States
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width:600px)');

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

    const muiTheme = createTheme({
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
        { key: 'results', text: language === 'en' ? 'Results' : 'Výsledky' },
        { key: 'about', text: language === 'en' ? 'About' : 'O aplikácii' }
    ];

    // Ref pre uloženie timeout ID
    const logoutTimer = useRef(null);

    // Funkcia na nastavenie alebo resetovanie timeoutu
    const resetLogoutTimer = useCallback(() => {
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
        }
        // Nastavenie timeoutu na 5 minút (300000 ms)
        logoutTimer.current = setTimeout(() => {
            onLogout();
            alert(language === 'en' ? 'You have been logged out due to inactivity.' : 'Bol ste odhlásený kvôli nečinnosti.');
        }, 300000);
    }, [onLogout, language]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];

        // Pridanie poslucháčov udalostí
        events.forEach(event => {
            window.addEventListener(event, resetLogoutTimer);
        });

        // Nastavenie počiatku timeoutu
        resetLogoutTimer();

        // Vyčistenie poslucháčov udalostí pri odchode komponentu
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, resetLogoutTimer);
            });
            if (logoutTimer.current) {
                clearTimeout(logoutTimer.current);
            }
        };
    }, [resetLogoutTimer]);

    return (
        <ThemeProvider theme={muiTheme}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="static" sx={{ paddingX: isSmallScreen ? '1em' : '9em' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {language === 'en' ? "Operating Systems" : "Operačné Systémy"}
                    </Typography>
                    {/* Logout Button */}
                    <Tooltip title={language === 'en' ? "Logout" : "Odhlásiť sa"}>
                        <IconButton color="inherit" onClick={onLogout}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
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
                        {/* Dark Mode Toggle */}
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
                        {/* Language Switcher */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body2">
                                {language === 'en' ? "Language" : "Jazyk"}
                            </Typography>
                            <Box>
                                <FlagSwitcher language={language} setLanguage={setLanguage} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

            {/* Chatbox */}
            {showChat && (
                <Box sx={{ position: 'fixed', bottom: 80, right: 20, zIndex: 1300 }}>
                    <Chatbox toggleChatVisibility={toggleChatVisibility} language={language} />
                </Box>
            )}

            {/* Floating Action Button (Fab) for Chat Toggle */}
            {!showChat && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 1300
                    }}
                >
                    <Tooltip title={language === 'en' ? "Open Chat" : "Otvoriť Chat"}>
                        <Fab
                            color="primary"
                            aria-label="chat"
                            onClick={toggleChatVisibility}
                            size="large"
                        >
                            <ChatIcon />
                        </Fab>
                    </Tooltip>
                </Box>
            )}

            {/* Main Content */}
            <Box className="App" data-theme={darkMode ? 'dark' : 'light'}>
                {selectedPage === 'about' ? (
                    <AboutPage language={language} />
                ) : selectedPage === 'results' ? (
                    <ResultsPage language={language} csvRefreshTrigger={csvRefreshTrigger} />
                ) : (
                    <HomePage
                        language={language}
                        fileListRefreshTrigger={fileListRefreshTrigger}
                        handleFileListUpdate={handleFileListUpdate}
                        handleCsvCreated={handleCsvCreated}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
}

export default App;