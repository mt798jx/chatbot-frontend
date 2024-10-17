import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service';  // Import the services
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';

export default function ChartsOverviewDemo() {
    const [fileData, setFileData] = useState([]);

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
            } catch (error) {
                console.error('Error fetching files or comparison data', error);
            }
        };

        fetchFilesAndData();
    }, []);

    return (
        <Box sx={{ padding: 4 }}>
            <Grid container spacing={3}>
                {fileData.map(({ fileName, data }) => (
                    <Grid item xs={12} md={6} lg={4} key={fileName}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Comparison for {fileName}
                                </Typography>
                                <BarChart
                                    series={[
                                        { data: data.map((d) => d.count) },
                                    ]}
                                    height={290}
                                    xAxis={[{ data: data.map((d) => d.range), scaleType: 'band' }]}
                                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}