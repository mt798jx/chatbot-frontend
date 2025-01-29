import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, Label } from "recharts";
import { fetchCsv, fetchComparisonData } from '../file/services-react/_api/file-service';
import { Box, Paper, Typography, Grid, useMediaQuery } from "@mui/material";
import { styled } from '@mui/system';

// Vlastné štýly pre Paper komponenty
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.background.paper,
}));

const CustomTooltip = ({ active, payload, label, language }) => {
    if (active && payload && payload.length) {
        return (
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '4px',
                }}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {language === 'en' ? `Range: ${label}` : `Rozsah: ${label}`}
                </Typography>
                {payload.map((entry, index) => (
                    <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </Typography>
                ))}
            </Box>
        );
    }

    return null;
};

const MultipleScoreComparisonCharts = ({ refreshTrigger, language }) => {
    const [fileData, setFileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        const fetchFilesAndData = async () => {
            setLoading(true);
            setError('');
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

    // Memoizácia formátovaných dát pre optimalizáciu výkonu
    const memoizedFileData = useMemo(() => fileData, [fileData]);

    return (
        <Box
            sx={{
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
            ) : memoizedFileData.length === 0 ? (
                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'info.main', textAlign: 'center' }}>
                    {language === 'en' ? "No files available for comparison." : "Nie sú dostupné žiadne súbory na porovnanie."}
                </Typography>
            ) : (
                <Grid container spacing={isSmallScreen ? 2 : 4}>
                    {memoizedFileData.map(({ fileName, data }) => (
                        <Grid item xs={12} md={6} key={fileName}>
                            <StyledPaper>
                                <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                                    {language === 'en' ? `Comparison for ${fileName}` : `Porovnanie pre ${fileName}`}
                                </Typography>
                                <Box sx={{ width: '100%', height: isSmallScreen ? 250 : 400 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                            <XAxis dataKey="range">
                                                <Label value={language === 'en' ? "Range" : "Rozsah"} offset={-10} position="insideBottom" />
                                            </XAxis>
                                            <YAxis>
                                                <Label
                                                    angle={-90}
                                                    position="insideLeft"
                                                    style={{ textAnchor: 'middle' }}
                                                    value={language === 'en' ? "Score" : "Skóre"}
                                                />
                                            </YAxis>
                                            <Tooltip
                                                content={<CustomTooltip language={language} />}
                                            />
                                            <Legend verticalAlign="top" height={36} />
                                            <Bar
                                                dataKey="uploads"
                                                name={language === 'en' ? "Uploads" : "Nahrané"}
                                                fill="url(#colorUploads)"
                                                barSize={isSmallScreen ? 20 : 30}
                                                animationDuration={1500}
                                            />
                                            <Bar
                                                dataKey="results"
                                                name={language === 'en' ? "Results" : "Výsledky"}
                                                fill="url(#colorResults)"
                                                barSize={isSmallScreen ? 20 : 30}
                                                animationDuration={1500}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    {/* Definície gradientov */}
                                    <svg width={0} height={0}>
                                        <defs>
                                            <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorResults" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </Box>
                            </StyledPaper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default MultipleScoreComparisonCharts;