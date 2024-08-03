import Flag from 'react-world-flags';
import {IconButton, Menu, MenuItem, Typography, useMediaQuery} from "@mui/material";
import React, {useState} from "react";

const FlagSwitcher = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [language, setLanguage] = useState('en');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lang) => {
        setLanguage(lang);
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit">
                <Flag code={language === 'en' ? 'GB' : 'SK'} style={{ width: 24, height: 16 }} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(language)}
            >
                <MenuItem onClick={() => handleClose('en')}>
                    <Flag code="GB" style={{ width: 24, height: 16, marginRight: 8 }} />
                    <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">
                        English
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleClose('sk')}>
                    <Flag code="SK" style={{ width: 24, height: 16, marginRight: 8 }} />
                    <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">
                        Slovak
                    </Typography>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default FlagSwitcher;
