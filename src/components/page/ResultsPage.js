import React from 'react';
import { Typography, Box } from '@mui/material';
import MultipleScoreComparisonCharts from '../graph/MultipleScoreComparisonCharts';

const ResultsPage = ({ language, csvRefreshTrigger }) => {
    return (
        <>
            <Box className="graph-container" sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom>
                    {language === 'en' ? "Comparison Charts" : "Porovnávacie grafy"}
                </Typography>
                <MultipleScoreComparisonCharts language={language} refreshTrigger={csvRefreshTrigger} />
            </Box>
        </>
    );
};

export default ResultsPage;
