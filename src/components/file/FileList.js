import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import './FileList.css';
import { fetchFiles } from "./services-react/_api/file-service";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [deleteFileName, setDeleteFileName] = useState('');
    const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);

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

    const handleOpenConfirmDelete = (fileName) => {
        setDeleteFileName(fileName);
        setConfirmOpenDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setConfirmOpenDelete(false);
        setDeleteFileName(''); // Reset file name when canceling
    };

    const handleDelete = async () => {
        if (processing && deleteFileName === processingFile) {
            return;
        }
        try {
            const encodedFileName = encodeURIComponent(deleteFileName);
            const response = await fetch(`https://100.119.248.77:8445/delete?fileName=${encodedFileName}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                updateFileList();
                if (onFileDeleted) {
                    onFileDeleted();
                }
            } else {
                setError(language === 'en' ? 'Failed to delete file' : 'Nepodarilo sa odstrániť súbor');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error deleting file' : 'Chyba pri odstraňovaní súboru');
        } finally {
            setConfirmOpenDelete(false);
        }
    };

    const handlePreview = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://100.119.248.77:8445/preview?fileName=${encodedFileName}`);
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
            const response = await fetch(`https://100.119.248.77:8445/process-chatgpt?fileName=${encodedFileName}`);
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
            const response = await fetch(`https://100.119.248.77:8445/process-gemini?fileName=${encodedFileName}`);
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

    const handleCreateCsv = async (fileName) => {
        if (isCreating) {
            return;
        }
        setIsCreating(true);
        setCsvCreated(false);
        setError('');

        try {
            const baseName = fileName.replace('.csv', '-results.txt');
            const response = await fetch(`https://100.119.248.77:8445/create?fileName=${encodeURIComponent(baseName)}`);

            if (!response.ok) {
                const errorText = await response.json(); // Parse response as JSON
                setError(errorText.error || (language === 'en' ? 'Failed to create CSV file.' : 'Nepodarilo sa vytvoriť CSV súbor.'));
                return;
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                onCsvCreated();
                setCsvCreated(true);
                alert(language === 'en' ? `CSV file created successfully.` : `CSV súbor úspešne vytvorený.`);
            } else if (result.error) {
                setError(language === 'en' ? result.error : `Chyba: ${result.error}`);
            } else {
                alert(language === 'en' ? `CSV file created successfully.` : `CSV súbor úspešne vytvorený.`);
            }
        } catch (networkError) {
            console.error("Network error:", networkError);
            setError(language === 'en' ? 'Error creating CSV file.' : 'Chyba pri vytváraní CSV súboru.');
        } finally {
            setIsCreating(false);
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
                                            {/* Edit Button */}
                                            <IconButton aria-label="edit" size="small" onClick={() => handlePreview(file)}>
                                                <EditIcon color="text.secondary" fontSize="inherit" />
                                            </IconButton>

                                            {/* Create CSV Button */}
                                            <IconButton
                                                aria-label="create-csv"
                                                size="small"
                                                onClick={() => handleCreateCsv(file)}
                                                disabled={isCreating && file === selectedFile}>
                                                <PlayArrowIcon color="success" fontSize={isSmallScreen ? "inherit" : "small"} />
                                            </IconButton>

                                            {/* Delete Button */}
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => handleOpenConfirmDelete(file)}
                                                disabled={processing && file === processingFile}>
                                                <DeleteForeverIcon color="error" fontSize={isSmallScreen ? "inherit" : "small"} />
                                            </IconButton>
                                        </div>
                                    </Box>
                                ))
                            ) : (
                                <Typography sx={{ color: 'warning.main' }} variant={isSmallScreen ? "body2" : "body1"} >
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
                            borderRadius: 1,
                            maxWidth: '90%',
                            maxHeight: '90%',
                            overflowY: 'auto',
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
                                {language === 'en' ? 'Preview of' : 'Náhľad súboru'} {processing ? selectedFileProcessing : selectedFile}
                            </Typography>
                            <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {processing ? previewContentProcessing : previewContent}
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
                                endIcon={<PlayArrowIcon />}
                                color="success"
                                onClick={handleOpenConfirm}
                                disabled={processing || !selectedFile || (processing && selectedFile !== selectedFileProcessing)}>
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
                        {/* Tlačidlo Close - fixované v hornom rohu */}
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                zIndex: 1001
                            }}
                            onClick={handleClosePreviewFinal}
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
                                {language === 'en' ? 'Processed Results for' : 'Spracované výsledky pre'} {selectedFile}
                            </Typography>
                            <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {processResults}
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
                                endIcon={<PlayArrowIcon />}
                                color="success"
                                onClick={handleCreateCsv}
                                disabled={isCreating}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {isCreating
                                        ? (language === 'en' ? 'Creating CSV...' : 'Vytvára sa CSV...')
                                        : csvCreated
                                            ? (language === 'en' ? 'CSV Created' : 'CSV Vytvorené')
                                            : (language === 'en' ? 'Create CSV' : 'Vytvoriť CSV')}
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

            <Dialog open={confirmOpenDelete} onClose={handleCloseConfirmDelete}>
                <DialogTitle>
                    {language === 'en' ? 'Delete File' : 'Odstrániť súbor'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {language === 'en'
                            ? `Are you sure you want to delete the file "${deleteFileName}"?`
                            : `Ste si istí, že chcete odstrániť súbor "${deleteFileName}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} color="primary">
                        {language === 'en' ? 'Cancel' : 'Zrušiť'}
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        {language === 'en' ? 'Delete' : 'Odstrániť'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FileList;