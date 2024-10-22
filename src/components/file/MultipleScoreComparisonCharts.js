import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service';
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";

const MultipleScoreComparisonCharts = ({ refreshTrigger, language }) => {
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchFilesAndData = async () => {
            try {
                const files = await fetchCsv();
                const fileDataPromises = files.map(async (fileName) => {
                    const comparisonData = await fetchComparisonData(fileName);
                    const formattedData = formatComparisonData(comparisonData);
                    return { fileName: fileName.replace('-results.csv', ''), data: formattedData }; // Remove '-results.csv'
                });

                const allFileData = await Promise.all(fileDataPromises);
                setFileData(allFileData);
                setError('');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilesAndData();
    }, [refreshTrigger]);

    const formatComparisonData = (comparisonData) => {
        return Object.keys(comparisonData.uploadsScoreDistribution).map((range) => ({
            range,
            uploads: comparisonData.uploadsScoreDistribution[range],
            results: comparisonData.resultsScoreDistribution[range],
        }));
    };

    return (
        <Box className="graph-container">
            {loading ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>
                    {language === 'en' ? "Loading charts..." : "Načítavajú sa grafy..."}
                </Typography>
            ) : error ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>
                    {error}
                </Typography>
            ) : (
                fileData.map(({ fileName, data }) => (
                    <Paper sx={{ padding: 2 }} key={fileName}>
                        <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                            {language === 'en' ? `Comparison for ${fileName}` : `Porovnanie pre ${fileName}`}
                        </Typography>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="uploads" fill="#8884d8" name={language === 'en' ? "Uploads" : "Nahrané"} />
                                    <Bar dataKey="results" fill="#82ca9d" name={language === 'en' ? "Results" : "Výsledky"} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                ))
            )}
        </Box>
    );
};

export default MultipleScoreComparisonCharts;