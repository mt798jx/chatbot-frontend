import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service';
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";

const MultipleScoreComparisonCharts = ({ language }) => {
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
                    const formattedData = Object.keys(comparisonData).map((range) => ({
                        range,
                        count: comparisonData[range],
                    }));
                    return { fileName, data: formattedData };
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
    }, []);

    return (
        <Box sx={{
            margin: 2,
            padding: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper',
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 260,
            overflow: 'hidden'
        }}>
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
                    <Paper
                        key={fileName}
                        elevation={3}
                        sx={{
                            margin: 2,
                            padding: 2,
                            borderRadius: 1,
                            backgroundColor: 'background.paper',
                            boxShadow: 1,
                            width: '100%',
                        }}
                    >
                        <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                            {language === 'en' ? `Comparison for ${fileName}` : `Porovnanie pre ${fileName}`}
                        </Typography>
                        <Box sx={{ width: '100%', height: 400, marginTop: 2 }}>
                            <ResponsiveContainer width="100%" height={400}>  {/* Full width */}
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
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