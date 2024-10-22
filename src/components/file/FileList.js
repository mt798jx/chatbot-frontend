import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import './FileList.css';
import { fetchFiles } from "./services-react/_api/file-service";
import { Box, Button, CircularProgress, IconButton, Typography, useMediaQuery } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FileUpload from "./FileUpload";
import ConfirmationDialog from "../ConfirmationDialog";

const FileList = ({ onProcessingComplete, refreshTrigger, onCsvCreated, language, onFileDeleted }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewContent, setPreviewContent] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
    const [previewContentProcessing, setPreviewContentProcessing] = useState(null);
    const [selectedFileProcessing, setSelectedFileProcessing] = useState('');
    const [processResults, setProcessResults] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [processingFile, setProcessingFile] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [csvCreated, setCsvCreated] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false); // State for dialog confirmation
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const updateFileList = async () => {
        setLoading(true);
        try {
            const files = await fetchFiles();
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

    const handleDelete = async (fileName) => {
        if (processing && fileName === processingFile) {
            return;
        }
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://147.232.205.178:8443/delete?fileName=${encodedFileName}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert(language === 'en' ? `File deleted successfully: ${fileName}` : `Súbor bol úspešne odstránený: ${fileName}`);
                updateFileList();
                if (onFileDeleted) {
                    onFileDeleted();
                }
            } else {
                setError(language === 'en' ? 'Failed to delete file' : 'Nepodarilo sa odstrániť súbor');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error deleting file' : 'Chyba pri odstraňovaní súboru');
        }
    };

    const handlePreview = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://147.232.205.178:8443/preview?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.text();
                if (processing) {
                    setSelectedFileProcessing(fileName);
                    setPreviewContentProcessing(content);
                } else {
                    setSelectedFile(fileName);
                    setPreviewContent(content);
                    setSelectedFileProcessing(fileName);
                    setPreviewContentProcessing(content);
                }
            } else {
                setError(language === 'en' ? 'Failed to fetch file preview' : 'Nepodarilo sa načítať náhľad súboru');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error fetching file preview' : 'Chyba pri načítaní náhľadu súboru');
        }
    };

    const handleClosePreview = () => {
        setPreviewContent(null);
        setPreviewContentProcessing(null);
    };

    const handleClosePreviewFinal = () => {
        setPreviewContent(null);
        setPreviewContentProcessing(null);
        setSelectedFile('');
        setSelectedFileProcessing('');
        setProcessResults(null);
        setProcessing(false);
        setProcessingFile('');
        setIsCreating(false);
        setCsvCreated(false);
    };

    const handleProcessChatGPT = async () => {
        setConfirmOpen(false);
        if (processing) return;
        setProcessing(true);
        setProcessingFile(selectedFileProcessing);
        try {
            const encodedFileName = encodeURIComponent(selectedFileProcessing);
            const response = await fetch(`https://147.232.205.178:8443/process-chatgpt?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
                onProcessingComplete();
            } else {
                setError(language === 'en' ? 'Failed to process file using ChatGPT' : 'Nepodarilo sa spracovať súbor pomocou ChatGPT');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error processing file using ChatGPT' : 'Chyba pri spracovaní súboru pomocou ChatGPT');
        } finally {
            setProcessing(false);
        }
    };

    const handleProcessGemini = async () => {
        setConfirmOpen(false);
        if (processing) return;
        setProcessing(true);
        setProcessingFile(selectedFileProcessing);
        try {
            const encodedFileName = encodeURIComponent(selectedFileProcessing);
            const response = await fetch(`https://147.232.205.178:8443/process-gemini?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
                onProcessingComplete();
            } else {
                setError(language === 'en' ? 'Failed to process file using GeminiAI' : 'Nepodarilo sa spracovať súbor pomocou GeminiAI');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error processing file using GeminiAI' : 'Chyba pri spracovaní súboru pomocou GeminiAI');
        } finally {
            setProcessing(false);
        }
    };

    const handleOpenConfirm = () => {
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    const handleCreateCsv = async () => {
        if (isCreating) {
            return;
        }
        setIsCreating(true);
        setCsvCreated(false);

        try {
            const baseName = selectedFile.replace('.csv', '-results.txt');
            const response = await fetch(`https://147.232.205.178:8443/create?fileName=${baseName}`);
            if (response.ok) {
                onCsvCreated();
                setCsvCreated(true);
                alert(language === 'en' ? `CSV file created: ${baseName}` : `CSV súbor vytvorený: ${baseName}`);
            } else {
                setError(language === 'en' ? 'Failed to create CSV file' : 'Nepodarilo sa vytvoriť CSV súbor');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error creating CSV file' : 'Chyba pri vytváraní CSV súboru');
        } finally {
            setIsCreating(false);
            handleClosePreviewFinal();
        }
    };

    const handleUploadSuccess = () => {
        updateFileList();
        if (onFileDeleted) {
            onFileDeleted();
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
            <div className="title-upload-container">
                <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom className="title">
                    {language === 'en' ? 'Uploaded CSV Files' : 'Nahrané CSV súbory'}
                </Typography>
                <FileUpload onUploadSuccess={handleUploadSuccess} className="file-upload" language={language} />
            </div>
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
                                            paddingY: 0.8,
                                            borderBottom: index === fileList.length - 1 ? 'none' : '1px solid',
                                            borderColor: 'divider',
                                            backgroundColor: 'background.paper'
                                        }}
                                    >
                                        <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ flexGrow: 1, textAlign: 'left', marginRight: 1 }}>
                                            {file}
                                        </Typography>
                                        <div className="button-group">
                                            <IconButton aria-label="edit" size="small" onClick={() => handlePreview(file)}>
                                                <EditIcon color="text.secondary" fontSize="inherit"/>
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => handleDelete(file)}
                                                disabled={processing && file === processingFile}>
                                                <DeleteForeverIcon color="error" fontSize={isSmallScreen ? "inherit" : "small"}/>
                                            </IconButton>
                                        </div>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {language === 'en' ? 'No CSV files found.' : 'Nenašli sa žiadne CSV súbory.'}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>

            {(previewContent || previewContentProcessing) && (
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
                            padding: 2,
                            borderRadius: 1,
                            maxWidth: '90%',
                            maxHeight: '90%',
                            overflowY: 'auto',
                            boxShadow: 3,
                            textAlign: 'left'
                        }}>
                        <Typography variant={isSmallScreen ? "h7" : "h6"} sx={{ fontWeight: 'bold' }}>
                            {language === 'en' ? 'Preview of' : 'Náhľad súboru'} {processing ? selectedFileProcessing : selectedFile}
                        </Typography>
                        <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {processing ? previewContentProcessing : previewContent}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="outlined" startIcon={<CloseIcon />} color="error" onClick={handleClosePreview}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {language === 'en' ? 'Close' : 'Zavrieť'}
                                </Typography>
                            </Button>
                            <Button variant="outlined" endIcon={<PlayArrowIcon />} color="success" onClick={handleOpenConfirm} disabled={processing || !selectedFile || (processing && selectedFile !== selectedFileProcessing)}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {processing ? (language === 'en' ? 'Processing...' : 'Spracováva sa...') : (language === 'en' ? 'Process' : 'Spracovať')}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            <ConfirmationDialog open={confirmOpen} handleClose={handleCloseConfirm}
                                handleProcessChatGPT={handleProcessChatGPT}
                                handleProcessGemini={handleProcessGemini}
                                language={language}/>

            {processResults && (
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
                            padding: 2,
                            borderRadius: 1,
                            maxWidth: '90%',
                            maxHeight: '90%',
                            overflowY: 'auto',
                            boxShadow: 3,
                            textAlign: 'left'
                        }}>
                        <Typography variant={isSmallScreen ? "h7" : "h6"} sx={{ fontWeight: 'bold' }}>
                            {language === 'en' ? 'Processed Results for' : 'Spracované výsledky pre'} {selectedFile}
                        </Typography>
                        <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {processResults}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            <Button variant="outlined" startIcon={<CloseIcon />} color="error" onClick={handleClosePreviewFinal}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {language === 'en' ? 'Close' : 'Zavrieť'}
                                </Typography>
                            </Button>
                            <Button variant="outlined" endIcon={<PlayArrowIcon />} color="success" onClick={handleCreateCsv} disabled={isCreating}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {isCreating ? (language === 'en' ? 'Creating CSV...' : 'Vytvára sa CSV...') : csvCreated ? (language === 'en' ? 'CSV Created' : 'CSV Vytvorené') : (language === 'en' ? 'Create CSV' : 'Vytvoriť CSV')}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {processing && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <Draggable>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                color: '#333333',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                border: '1px solid #dddddd',
                                gap: '0.5em',
                                zIndex: 1000
                            }}
                        >
                            <React.Fragment>
                                <svg width={0} height={0}>
                                    <defs>
                                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#e01cd5" />
                                            <stop offset="100%" stopColor="#1CB5E0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <CircularProgress
                                    disableShrink
                                    size={55}
                                    thickness={4}
                                    sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }}
                                />
                            </React.Fragment>
                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                {language === 'en' ? 'Processing file:' : 'Spracováva sa súbor:'} {processingFile}
                            </Typography>
                        </Box>
                    </Draggable>
                </Box>
            )}
        </Box>
    );
};

export default FileList;