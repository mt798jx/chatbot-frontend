import React, { useEffect, useState } from 'react';
import { fetchCsv } from '../services-react/_api/file-service';
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const GeneratedList = ({ refreshTrigger, language }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const updateFileList = async () => {
        setLoading(true);
        try {
            const files = await fetchCsv();
            setFileList(files);
            setError('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        updateFileList();
    }, [refreshTrigger]);

    const handleDownload = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://147.232.205.178:8443/download?fileName=${encodedFileName}`, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorMessage = language === 'en' ? 'Failed to fetch file' : 'Nepodarilo sa načítať súbor';
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            const successMessage = language === 'en'
                ? `File "${fileName}" has been successfully downloaded. Check your default downloads folder.`
                : `Súbor "${fileName}" bol úspešne stiahnutý. Skontrolujte svoj predvolený priečinok na sťahovanie.`;
            alert(successMessage);
        } catch (error) {
            const errorDownloadMessage = language === 'en' ? `Error downloading file: ${error.message}` : `Chyba pri sťahovaní súboru: ${error.message}`;
            setError(errorDownloadMessage);
        }
    };

    return (
        <Box
            sx={{
                margin: 2,
                padding: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 250,
                overflow: 'hidden'
            }}
        >
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                {language === 'en' ? "Generated CSV Files" : "Výsledné CSV súbory"}
            </Typography>
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 200,
                    paddingRight: 2
                }}
            >
                {loading ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>
                        {language === 'en' ? "Loading files..." : "Načítavajú sa súbory..."}
                    </Typography>
                ) : error ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>
                        {error}
                    </Typography>
                ) : (
                    <Box component="ul" sx={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {fileList.length > 0 ? (
                            fileList.map((file, index) => (
                                <Box
                                    component="li"
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingY: 1,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        backgroundColor: 'background.paper'
                                    }}
                                >
                                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ flexGrow: 1, textAlign: 'left', marginRight: 1 }}>
                                        {file}
                                    </Typography>
                                    <IconButton aria-label="download" size="small" onClick={() => handleDownload(file)}>
                                        <DownloadIcon color="success" fontSize={isSmallScreen ? "inherit" : "small"} />
                                    </IconButton>
                                </Box>
                            ))
                        ) : (
                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                {language === 'en' ? "No CSV files found" : "Nenašli sa žiadne súbory CSV"}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default GeneratedList;