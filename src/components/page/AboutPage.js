import React from 'react';
import { Box, Typography } from '@mui/material';

const AboutPage = ({ language }) => {
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                {language === 'en' ? "About" : "O aplikácii"}
            </Typography>
            <Typography variant="body1">
                {language === 'en'
                    ? "This application is designed to help you manage your files efficiently. It includes features such as file upload, listing, and comparison charts."
                    : "Táto aplikácia je navrhnutá na efektívne spravovanie vašich súborov. Zahŕňa funkcie ako nahrávanie súborov, ich zoznam a porovnávacie grafy."}
            </Typography>
        </Box>
    );
};

export default AboutPage;
