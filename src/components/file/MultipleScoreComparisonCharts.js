import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';

export default function ChartsOverviewDemo() {
    const [fileData, setFileData] = useState([]);

    useEffect(() => {
        const fetchFilesAndData = async () => {
            try {
                const files = await fetchCsv();
                console.log('Files fetched:', files);

                if (!files || files.length === 0) {
                    console.error("No files found");
                    return;
                }

                const fileDataPromises = files.map(async (fileName) => {
                    const comparisonData = await fetchComparisonData(fileName);
                    console.log(`Data for ${fileName}:`, comparisonData);

                    if (!comparisonData || typeof comparisonData !== 'object') {
                        console.error(`Invalid data for file: ${fileName}`);
                        return { fileName, data: [] };
                    }

                    const formattedData = Object.keys(comparisonData).map((range) => ({
                        range,
                        count: comparisonData[range],
                    }));
                    return { fileName, data: formattedData };
                });

                const allFileData = await Promise.all(fileDataPromises);
                console.log("All file data:", allFileData);
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
                                        { data: data?.map((d) => d.count) || [] },
                                    ]}
                                    xAxis={[{ data: data?.map((d) => d.range) || [], scaleType: 'band' }]}
                                    height={290}
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