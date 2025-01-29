import React from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import MultipleScoreComparisonCharts from '../graph/MultipleScoreComparisonCharts';

const ResultsPage = ({ language, csvRefreshTrigger }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Box
            sx={{
                padding: isSmallScreen ? 2 : 4,
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
            }}
        >
            <Typography
                variant={isSmallScreen ? "h6" : "h4"}
                gutterBottom
                sx={{ textAlign: 'center', marginBottom: isSmallScreen ? 2 : 4 }}
            >
                {language === 'en' ? "Comparison Charts" : "Porovnávacie grafy"}
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    padding: isSmallScreen ? 2 : 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <MultipleScoreComparisonCharts language={language} refreshTrigger={csvRefreshTrigger} />
            </Paper>
        </Box>
    );
};

export default ResultsPage;