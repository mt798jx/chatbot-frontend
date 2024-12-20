import React, { useEffect, useState } from 'react';
import { fetchTxt } from './services-react/_api/file-service';
import { Box, Button, IconButton, Typography, useMediaQuery } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CreateIcon from '@mui/icons-material/Create';

const TxtList = ({ refreshTrigger, onCsvCreated, language }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewContent, setPreviewContent] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
    const [processing, setProcessing] = useState(false);
    const [csvCreated, setCsvCreated] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const updateFileList = async () => {
        setLoading(true);
        try {
            const files = await fetchTxt();
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

    const handlePreview = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://100.119.248.77:8445/previewtext?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.text();
                setSelectedFile(fileName);
                setPreviewContent(content);
            } else {
                setError(language === 'en' ? 'Failed to fetch file preview' : 'Nepodarilo sa získať náhľad súboru');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error fetching file preview' : 'Chyba pri načítaní náhľadu súboru');
        }
    };

    const handleClosePreview = () => {
        setPreviewContent(null);
        setSelectedFile('');
        setProcessing(false);
        setCsvCreated(false);
    };

    const handleProcess = async () => {
        if (processing) {
            return;
        }
        setProcessing(true);
        setCsvCreated(false);

        try {
            const encodedFileName = encodeURIComponent(selectedFile);
            const response = await fetch(`https://100.119.248.77:8445/create?fileName=${encodedFileName}`);
            if (response.ok) {
                setCsvCreated(true);
                const baseName = selectedFile.substring(0, selectedFile.lastIndexOf('.'));
                onCsvCreated();
                alert(language === 'en' ? `CSV file created: ${baseName}.csv` : `CSV súbor vytvorený: ${baseName}.csv`);
                handleClosePreview();
            } else {
                setError(language === 'en' ? 'Failed to create CSV file' : 'Nepodarilo sa vytvoriť CSV súbor');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error creating CSV file' : 'Chyba pri vytváraní CSV súboru');
        } finally {
            setProcessing(false);
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
                maxHeight: 260,
                overflow: 'hidden'
            }}
        >
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                {language === 'en' ? 'Created TXT Files' : 'Vytvorené TXT súbory'}
            </Typography>
            <Box
                sx={{
                    marginTop: 1,
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 200,
                    paddingRight: 2
                }}
            >
                {loading ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>
                        {language === 'en' ? 'Loading files...' : 'Načítavajú sa súbory...'}
                    </Typography>
                ) : error ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Box
                            component="ul"
                            sx={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}
                        >
                            {fileList.length > 0 ? (
                                fileList.map((file, index) => (
                                    <Box
                                        component="li"
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingY: 0.8,
                                            borderBottom: index === fileList.length - 1 ? 'none' : '1px solid',
                                            borderColor: 'divider',
                                            backgroundColor: 'background.paper'
                                        }}
                                    >
                                        <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ flexGrow: 1, textAlign: 'left', marginRight: 1 }}>
                                            {file}
                                        </Typography>
                                        <IconButton aria-label="edit" size="small" sx={isSmallScreen ? {} : { padding: '6px' }} onClick={() => handlePreview(file)}>
                                            <EditIcon color="text.secondary" fontSize="inherit"/>
                                        </IconButton>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>
                                    {language === 'en' ? 'No TXT files found.' : 'Nenašli sa žiadne TXT súbory.'}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>

            {previewContent && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                    <Box
                        sx={{
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            maxWidth: '90%',
                            maxHeight: '90%',
                            overflow: 'hidden',
                            boxShadow: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            textAlign: 'left'
                        }}>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                zIndex: 1001
                            }}
                            onClick={handleClosePreview}
                            color="error">
                            <CloseIcon />
                        </IconButton>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: 2
                            }}>
                            <Typography variant={isSmallScreen ? "h7" : "h6"} sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                {language === 'en' ? 'Preview of' : 'Náhľad súboru'} {selectedFile}
                            </Typography>
                            <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {previewContent}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                                padding: '8px 16px',
                                display: 'flex',
                                justifyContent: 'center',
                                backgroundColor: 'background.paper'
                            }}>
                            <Button
                                variant="outlined"
                                endIcon={<CreateIcon />}
                                color="success"
                                onClick={handleProcess}
                                disabled={processing || !selectedFile}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {processing
                                        ? (language === 'en' ? 'Creating CSV...' : 'Vytvára sa CSV...')
                                        : (csvCreated
                                            ? (language === 'en' ? 'CSV Created' : 'CSV vytvorené')
                                            : (language === 'en' ? 'Create CSV' : 'Vytvoriť CSV'))}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
};

export default TxtList;