import React from "react";
import { Box, IconButton, Tooltip, Typography, useMediaQuery } from "@mui/material";
import FlagSwitcher from "./FlagSwitcher";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const HeaderSection = ({ language, setLanguage, darkMode, toggleDarkMode }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const tooltipTitle = language === 'en'
        ? (darkMode ? 'Dark mode' : 'Light mode')
        : (darkMode ? 'Tmavý režim' : 'Svetlý režim');

    return (
        <Box sx={{ marginBottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
                variant={isSmallScreen ? "h4" : "h3"}
                sx={{ fontWeight: 'regular', textAlign: 'center' }}
                gutterBottom
                className="header"
            >
                {language === 'en' ? "Operating Systems" : "Operačné Systémy"}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: isSmallScreen ? '100%' : '50%',
                    maxWidth: '600px',
                    paddingX: 2,
                    marginTop: 1,
                }}
            >
                <FlagSwitcher language={language} setLanguage={setLanguage} />

                <Tooltip title={tooltipTitle}>
                    <IconButton onClick={toggleDarkMode} color="inherit">
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default HeaderSection;
