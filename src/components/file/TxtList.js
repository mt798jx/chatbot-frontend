import React, { useEffect, useState } from 'react';
import { fetchTxt } from '../services-react/_api/file-service';
import './TxtList.css';
import { Button, IconButton, Typography, useMediaQuery } from '@mui/material';
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
            const response = await fetch(`https://147.232.205.178:8443/previewtext?fileName=${encodedFileName}`);
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
            const response = await fetch(`https://147.232.205.178:8443/create?fileName=${encodedFileName}`);
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
        <div className="file-list-container">
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                {language === 'en' ? 'Created TXT Files' : 'Vytvorené TXT súbory'}
            </Typography>
            <div className="file-list-content">
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
                        <div className="file-list">
                            <ul>
                                {fileList.length > 0 ? (
                                    fileList.map((file, index) => (
                                        <li key={index}>
                                            <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">
                                                {file}
                                            </Typography>
                                            <IconButton aria-label="edit"
                                                        size="small"
                                                        className="icon-button"
                                                        onClick={() => handlePreview(file)}>
                                                <EditIcon
                                                    color="text.secondary"
                                                    fontSize="inherit"
                                                    style={isSmallScreen ? {}: {padding: '1px'}}
                                                />
                                            </IconButton>
                                        </li>
                                    ))
                                ) : (
                                    <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                        {language === 'en' ? 'No TXT files found.' : 'Nenašli sa žiadne TXT súbory.'}
                                    </Typography>
                                )}
                            </ul>
                        </div>

                        {previewContent && (
                            <div className="preview-modal">
                                <div className="preview-content">
                                    <Typography variant={isSmallScreen ? "h7" : "h6"} sx={{ fontWeight: 'bold' }}>
                                        {language === 'en' ? 'Preview of' : 'Náhľad súboru'} {selectedFile}
                                    </Typography>
                                    <Typography variant={isSmallScreen ? "body2" : "body1"}
                                                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                    >
                                        {previewContent}
                                    </Typography>
                                    <div className="preview-buttons">
                                        <Button variant="outlined"
                                                startIcon={<CloseIcon />}
                                                className="icon-button"
                                                color="error"
                                                onClick={handleClosePreview}
                                        >
                                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                                {language === 'en' ? 'Close' : 'Zavrieť'}
                                            </Typography>
                                        </Button>
                                        <Button variant="outlined"
                                                endIcon={<CreateIcon />}
                                                className="icon-button"
                                                color="success"
                                                onClick={handleProcess}
                                                disabled={processing || !selectedFile}
                                        >
                                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                                {processing
                                                    ? (language === 'en' ? 'Creating CSV...' : 'Vytvára sa CSV...')
                                                    : (csvCreated
                                                        ? (language === 'en' ? 'CSV Created' : 'CSV vytvorené')
                                                        : (language === 'en' ? 'Create CSV' : 'Vytvoriť CSV'))}
                                            </Typography>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TxtList;