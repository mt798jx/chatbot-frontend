import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { fetchCsv, fetchComparisonData } from '../file/services-react/_api/file-service';
import { Box, Paper, Typography, useMediaQuery } from "@mui/material";

const MultipleScoreComparisonCharts = ({ refreshTrigger, language }) => {
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchFilesAndData = async () => {
            try {
                const files = (await fetchCsv()) || [];
                if (!Array.isArray(files)) {
                    throw new Error(language === 'en' ? "Invalid file data received." : "Neplatné dáta súborov.");
                }

                if (files.length === 0) {
                    setFileData([]);
                    setError(language === 'en' ? "No files available for comparison." : "Nie sú dostupné žiadne súbory na porovnanie.");
                    return;
                }

                const fileDataPromises = files.map(async (fileName) => {
                    try {
                        const comparisonData = await fetchComparisonData(fileName);

                        if (!comparisonData || !comparisonData.uploadsScoreDistribution || !comparisonData.resultsScoreDistribution)
                            return null;

                        const formattedData = formatComparisonData(comparisonData);
                        return { fileName: fileName.replace('-results.csv', ''), data: formattedData };
                    } catch (fetchError) {
                        console.error(`Error processing file ${fileName}:`, fetchError);
                        return null;
                    }
                });

                const allFileData = (await Promise.all(fileDataPromises)).filter(data => data !== null);
                setFileData(allFileData);
                setError('');
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilesAndData();
    }, [refreshTrigger, language]);

    const formatComparisonData = (comparisonData) => {
        return Object.keys(comparisonData.uploadsScoreDistribution).map((range) => ({
            range,
            uploads: comparisonData.uploadsScoreDistribution[range],
            results: comparisonData.resultsScoreDistribution[range],
        }));
    };

    return (
        <Box
            className="graph-container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: 2,
            }}
        >
            {loading ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main', textAlign: 'center' }}>
                    {language === 'en' ? "Loading charts..." : "Načítavajú sa grafy..."}
                </Typography>
            ) : error ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main', textAlign: 'center' }}>
                    {error}
                </Typography>
            ) : fileData.length === 0 ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'info.main', textAlign: 'center' }}>
                    {language === 'en' ? "No files available for comparison." : "Nie sú dostupné žiadne súbory na porovnanie."}
                </Typography>
            ) : (
                fileData.map(({ fileName, data }) => (
                    <Paper sx={{ padding: isSmallScreen ? 1 : 2, borderRadius: 2, boxShadow: 3, width: '100%' }} key={fileName}>
                        <Typography variant={isSmallScreen ? "body2" : "h6"} gutterBottom>
                            {language === 'en' ? `Comparison for ${fileName}` : `Porovnanie pre ${fileName}`}
                        </Typography>
                        <Box sx={{ width: '100%', height: isSmallScreen ? 200 : 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
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
