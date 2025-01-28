import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import { fetchCsv, fetchFiles, fetchTxt } from "./services-react/_api/file-service";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Typography, useMediaQuery, Menu, MenuItem } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import ConfirmationDialog from "./ConfirmationDialog";
import CreateIcon from "@mui/icons-material/Create";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import NoteAddIcon from '@mui/icons-material/NoteAdd';

const FileList = ({ onProcessingComplete, refreshTrigger, onCsvCreated, language, onFileDeleted }) => {
    // --- STAVY pre HLAVNÝ zoznam nahraných CSV súborov ---
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- STAVY pre ZOZNAM vygenerovaných (spracovaných) CSV a TXT súborov ---
    const [generatedFileList, setGeneratedFileList] = useState([]);
    const [selectedFileTXT, setSelectedFileTXT] = useState('');
    const [previewContentTXT, setPreviewContentTXT] = useState(null);
    const [generatedTxtFiles, setGeneratedTxtFiles] = useState([]);
    const [processingTXT, setProcessingTXT] = useState(false);
    const [csvCreatedTXT, setCsvCreatedTXT] = useState(false);

    // --- STAVY pre náhľad súboru (Preview) ---
    const [previewContent, setPreviewContent] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');

    // --- STAVY pre náhľad pri spracúvaní (aby sa dalo spracovať po otvorení Preview) ---
    const [previewContentProcessing, setPreviewContentProcessing] = useState(null);
    const [selectedFileProcessing, setSelectedFileProcessing] = useState('');

    // --- STAVY ohľadom spracovania súborov (ChatGPT / Gemini) ---
    const [processResults, setProcessResults] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [processingFile, setProcessingFile] = useState('');

    // --- STAVY pre vytváranie výsledného CSV ---
    const [isCreating, setIsCreating] = useState(false);
    const [csvCreated, setCsvCreated] = useState(false);

    // --- STAVY pre Confirm dialóg na spracovanie (ChatGPT / Gemini) ---
    const [confirmOpen, setConfirmOpen] = useState(false);

    // --- STAVY pre Confirm dialóg na zmazanie súboru ---
    const [deleteFileName, setDeleteFileName] = useState('');
    const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);

    // --- STAVY pre Confirm dialóg na stiahnutie vygenerovaného CSV ---
    const [confirmOpenDownload, setConfirmOpenDownload] = useState(false);
    const [selectedFileDownload, setSelectedFileDownload] = useState('');

    // --- STAVY pre Menu ---
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);

    // Rozlíšenie menšieho displeja
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    // Načítanie zoznamu nahraných CSV súborov zo servera
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

    // Načítanie zoznamu vygenerovaných (spracovaných) CSV súborov zo servera
    const updateGeneratedFileList = async () => {
        try {
            const generatedFiles = await fetchCsv();
            setGeneratedFileList(generatedFiles);
        } catch (error) {
            setError(error.message);
        }
    };

    // Načítanie zoznamu vygenerovaných TXT súborov zo servera
    const loadTXTfile = async () => {
        try {
            const txts = await fetchTxt();
            setGeneratedTxtFiles(txts);
        } catch (error) {
            setError(error.message);
        }
    };

    // Volanie funkcií na načítanie súborov pri mountnutí komponentu a pri zmene refreshTrigger
    useEffect(() => {
        updateFileList();
        updateGeneratedFileList();
        loadTXTfile();
    }, [refreshTrigger]);

    // -- Handler pre otváranie dialógu na potvrdenie zmazania súboru --
    const handleOpenConfirmDelete = (fileName) => {
        setDeleteFileName(fileName);
        setConfirmOpenDelete(true);
    };

    // Zavretie dialógu na zmazanie a resetovanie stavu
    const handleCloseConfirmDelete = () => {
        setConfirmOpenDelete(false);
        setDeleteFileName('');
    };

    // Funkcia na zmazanie súboru zo servera
    const handleDelete = async () => {
        if (processing && deleteFileName === processingFile) {
            return;
        }
        try {
            const encodedFileName = encodeURIComponent(deleteFileName);
            const response = await fetch(`https://api.mtvrdon.com/delete?fileName=${encodedFileName}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Po úspešnom zmazaní obnov zoznamy súborov
                updateFileList();
                updateGeneratedFileList();

                if (onFileDeleted) {
                    onFileDeleted();
                }
            } else {
                setError(language === 'en'
                    ? 'Failed to delete file'
                    : 'Nepodarilo sa odstrániť súbor');
            }
        } catch (error) {
            setError(language === 'en'
                ? 'Error deleting file'
                : 'Chyba pri odstraňovaní súboru');
        } finally {
            setConfirmOpenDelete(false);
        }
    };

    // -- Handler pre získanie náhľadu obsahu súboru --
    const handlePreview = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://api.mtvrdon.com/preview?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.text();
                // Ak sa súbor spracováva, uložím ho do spracovacej časti
                if (processing) {
                    setSelectedFileProcessing(fileName);
                    setPreviewContentProcessing(content);
                } else {
                    // Inak nastavím štandardný náhľad
                    setSelectedFile(fileName);
                    setPreviewContent(content);
                    setSelectedFileProcessing(fileName);
                    setPreviewContentProcessing(content);
                }
            } else {
                setError(language === 'en'
                    ? 'Failed to fetch file preview'
                    : 'Nepodarilo sa načítať náhľad súboru');
            }
        } catch (error) {
            setError(language === 'en'
                ? 'Error fetching file preview'
                : 'Chyba pri načítaní náhľadu súboru');
        }
    };

    // -- Zatvorenie náhľadu (iba prerušenie) --
    const handleClosePreview = () => {
        setPreviewContent(null);
        setPreviewContentProcessing(null);
    };

    // -- Kompletné zatvorenie náhľadu a resetovanie príslušných stavov --
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

    // -- Spracovanie súboru pomocou ChatGPT --
    const handleProcessChatGPT = async () => {
        setConfirmOpen(false);
        if (processing) return;
        setProcessing(true);
        setProcessingFile(selectedFileProcessing);
        try {
            const encodedFileName = encodeURIComponent(selectedFileProcessing);
            const response = await fetch(`https://api.mtvrdon.com/process-chatgpt?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
                onProcessingComplete();
            } else {
                setError(language === 'en'
                    ? 'Failed to process file using ChatGPT'
                    : 'Nepodarilo sa spracovať súbor pomocou ChatGPT');
            }
        } catch (error) {
            setError(language === 'en'
                ? 'Error processing file using ChatGPT'
                : 'Chyba pri spracovaní súboru pomocou ChatGPT');
        } finally {
            setProcessing(false);
        }
    };

    // -- Spracovanie súboru pomocou Gemini --
    const handleProcessGemini = async () => {
        setConfirmOpen(false);
        if (processing) return;
        setProcessing(true);
        setProcessingFile(selectedFileProcessing);
        try {
            const encodedFileName = encodeURIComponent(selectedFileProcessing);
            const response = await fetch(`https://api.mtvrdon.com/process-gemini?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
                onProcessingComplete();
            } else {
                setError(language === 'en'
                    ? 'Failed to process file using GeminiAI'
                    : 'Nepodarilo sa spracovať súbor pomocou GeminiAI');
            }
        } catch (error) {
            setError(language === 'en'
                ? 'Error processing file using GeminiAI'
                : 'Chyba pri spracovaní súboru pomocou GeminiAI');
        } finally {
            setProcessing(false);
        }
    };

    // -- Otvorenie dialógu na potvrdenie spracovania (ChatGPT/Gemini) --
    const handleOpenConfirm = () => {
        setConfirmOpen(true);
    };
    const handleCloseConfirm = () => {
        setConfirmOpen(false);
    };

    // -- Vytvorenie výsledného CSV súboru na základe spracovaných dát --
    const handleCreateCsv = async () => {
        if (isCreating) {
            return;
        }
        setIsCreating(true);
        setCsvCreated(false);
        setError('');

        try {
            const encodedFileName = encodeURIComponent(selectedFile);
            const baseName = encodedFileName.replace('.csv', '-results.txt');
            const response = await fetch(`https://api.mtvrdon.com/create?fileName=${encodeURIComponent(baseName)}`);

            if (!response.ok) {
                const errorText = await response.json();
                setError(errorText.error || (language === 'en'
                    ? 'Failed to create CSV file.'
                    : 'Nepodarilo sa vytvoriť CSV súbor.'));
                return;
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                onCsvCreated();
                setCsvCreated(true);
                alert(language === 'en'
                    ? `CSV file created successfully.`
                    : `CSV súbor úspešne vytvorený.`);
                // Obnov zoznam vygenerovaných CSV súborov po vytvorení nového súboru
                updateGeneratedFileList();
                handleClosePreviewFinal();
            } else if (result.error) {
                setError(language === 'en'
                    ? result.error
                    : `Chyba: ${result.error}`);
            } else {
                alert(language === 'en'
                    ? `CSV file created successfully.`
                    : `CSV súbor úspešne vytvorený.`);
                updateGeneratedFileList();
            }
        } catch (networkError) {
            console.error("Network error:", networkError);
            setError(language === 'en'
                ? 'Error creating CSV file.'
                : 'Chyba pri vytváraní CSV súboru.');
        } finally {
            setIsCreating(false);
        }
    };

    // -- Náhľad TXT súboru --
    const handlePreviewTXT = async (fileName) => {
        try {
            const encodedFileName = encodeURIComponent(fileName);
            const response = await fetch(`https://api.mtvrdon.com/previewtext?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.text();
                setSelectedFileTXT(fileName);
                setPreviewContentTXT(content);
            } else {
                setError(language === 'en' ? 'Failed to fetch file preview' : 'Nepodarilo sa získať náhľad súboru');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error fetching file preview' : 'Chyba pri načítaní náhľadu súboru');
        }
    };

    // -- Spracovanie TXT súboru na vytvorenie CSV --
    const handleProcess = async () => {
        if (processingTXT) {
            return;
        }
        setProcessingTXT(true);
        setCsvCreatedTXT(false);

        try {
            const encodedFileName = encodeURIComponent(selectedFileTXT);
            const response = await fetch(`https://api.mtvrdon.com/create?fileName=${encodedFileName}`);
            if (response.ok) {
                setCsvCreatedTXT(true);
                const baseName = selectedFileTXT.substring(0, selectedFileTXT.lastIndexOf('.'));
                alert(language === 'en' ? `CSV file created: ${baseName}.csv` : `CSV súbor vytvorený: ${baseName}.csv`);
                handleClosePreviewTXT();
            } else {
                setError(language === 'en' ? 'Failed to create CSV file' : 'Nepodarilo sa vytvoriť CSV súbor');
            }
        } catch (error) {
            setError(language === 'en' ? 'Error creating CSV file' : 'Chyba pri vytváraní CSV súboru');
        } finally {
            setProcessing(false);
        }
    };

    // -- Zavretie náhľadu TXT súboru a reset stavov --
    const handleClosePreviewTXT = () => {
        updateGeneratedFileList();
        setPreviewContentTXT(null);
        setSelectedFileTXT('');
        setProcessingTXT(false);
        setCsvCreatedTXT(false);
    };

    // -- DOWNLOAD vygenerovaného CSV súboru --
    const handleOpenConfirmDownload = (fileName) => {
        setSelectedFileDownload(fileName);
        setConfirmOpenDownload(true);
    };

    const handleCloseConfirmDownload = () => {
        setConfirmOpenDownload(false);
        setSelectedFileDownload('');
    };

    // -- Sťahovanie vybraného súboru zo servera --
    const handleDownload = async () => {
        try {
            const encodedFileName = encodeURIComponent(selectedFileDownload);
            const response = await fetch(`https://api.mtvrdon.com/download?fileName=${encodedFileName}`, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorMessage = language === 'en'
                    ? 'Failed to fetch file'
                    : 'Nepodarilo sa načítať súbor';
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = selectedFileDownload;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            setError(language === 'en'
                ? `Error downloading file: ${error.message}`
                : `Chyba pri sťahovaní súboru: ${error.message}`
            );
        } finally {
            setConfirmOpenDownload(false);
        }
    };

    // --- Handlery pre menu ---
    const handleMenuOpen = (event, file) => {
        setAnchorEl(event.currentTarget);
        setCurrentFile(file);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentFile(null);
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
                maxHeight: 600,
                overflow: 'hidden'
            }}
        >
            {/* Nadpis sekcie */}
            <div>
                <Typography
                    variant={isSmallScreen ? "h6" : "h5"}
                    gutterBottom
                    className="title"
                    sx = {{ paddingBottom: '10px' }}
                >
                    {language === 'en'
                        ? 'Uploaded CSV Files'
                        : 'Nahrané CSV súbory'}
                </Typography>
            </div>

            {/* Zoznam nahraných súborov */}
            <Box
                sx={{
                    marginTop: 1,
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 380,
                    paddingRight: 2
                }}
            >
                {loading ? (
                    <Typography
                        variant={isSmallScreen ? "body2" : "body1"}
                        sx={{ color: 'warning.main' }}
                    >
                        {language === 'en'
                            ? 'Loading files...'
                            : 'Načítavajú sa súbory...'}
                    </Typography>
                ) : error ? (
                    <Typography
                        variant={isSmallScreen ? "body2" : "body1"}
                        sx={{ color: 'error.main' }}
                    >
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Box
                            component="ul"
                            sx={{ listStyle: 'none', padding: 0, margin: 0 }}
                        >
                            {fileList.length > 0 ? (
                                fileList.map((file, index) => {
                                    // Kontrola, či súbor má vygenerovaný CSV výsledok
                                    const downloadfile = file.replace('.csv', '-results.csv');
                                    const canDownload = Array.isArray(generatedFileList) && generatedFileList.includes(downloadfile);

                                    // Kontrola, či súbor má vygenerovaný TXT výsledok
                                    const relatedTxtFile = `${file.replace('.csv', '')}-results.txt`;
                                    const canPreview = Array.isArray(generatedTxtFiles) && generatedTxtFiles.includes(relatedTxtFile);

                                    return (
                                        <Box
                                            component="li"
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingY: 0.8,
                                                borderBottom:
                                                    index === fileList.length - 1
                                                        ? 'none'
                                                        : '1px solid',
                                                borderColor: 'divider',
                                                backgroundColor: 'background.paper'
                                            }}
                                        >
                                            <Typography
                                                variant={isSmallScreen ? "body2" : "body1"}
                                                sx={{
                                                    flexGrow: 1,
                                                    textAlign: 'left',
                                                    marginRight: 1
                                                }}
                                            >
                                                {file}
                                            </Typography>
                                            <div>
                                                {/* Tlačidlo pre Menu */}
                                                <IconButton
                                                    aria-label="more"
                                                    onClick={(e) => handleMenuOpen(e, file)}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl) && currentFile === file}
                                                    onClose={handleMenuClose}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    {canPreview && (
                                                        <MenuItem
                                                            onClick={() => {
                                                                handlePreviewTXT(relatedTxtFile);
                                                                handleMenuClose();
                                                            }}
                                                        >
                                                            <VisibilityIcon color="info" fontSize="small" sx={{ marginRight: 1 }} />
                                                            {language === 'en' ? 'Preview result TXT' : 'Náhľad výsledný TXT'}
                                                            <NoteAddIcon color="secondary" fontSize="small" sx={{ marginRight: 0.6, marginLeft: 0.6 }} />
                                                            {language === 'en' ? 'Create result CSV' : 'Vytvor výsledný CSV'}
                                                        </MenuItem>
                                                    )}
                                                    {canDownload && (
                                                        <MenuItem
                                                            onClick={() => {
                                                                handleOpenConfirmDownload(downloadfile);
                                                                handleMenuClose();
                                                            }}
                                                        >
                                                            <DownloadIcon fontSize="small" sx={{ marginRight: 1 }} color='success'/>
                                                            {language === 'en' ? 'Download CSV' : 'Stiahnuť CSV'}
                                                        </MenuItem>
                                                    )}
                                                    <MenuItem
                                                        onClick={() => {
                                                            handlePreview(file);
                                                            handleMenuClose();
                                                        }}
                                                    >
                                                        <VisibilityIcon color="info" fontSize="small" sx={{ marginRight: 1 }} />
                                                        {language === 'en' ? 'Preview upload CSV' : 'Náhľad nahraný CSV'}
                                                        <NoteAddIcon color="secondary" fontSize="small" sx={{ marginRight: 0.6, marginLeft: 0.6 }} />
                                                        {language === 'en' ? 'Create result TXT' : 'Vytvoriť výsledný TXT'}
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleOpenConfirmDelete(file);
                                                            handleMenuClose();
                                                        }}
                                                        disabled={processing && file === processingFile}
                                                    >
                                                        <DeleteForeverIcon fontSize="small" sx={{ marginRight: 1 }} color='error'/>
                                                        {language === 'en' ? 'Delete file' : 'Odstrániť súbor'}
                                                    </MenuItem>
                                                </Menu>
                                            </div>
                                        </Box>
                                    );
                                })
                            ) : (
                                <Typography
                                    sx={{ color: 'warning.main' }}
                                    variant={isSmallScreen ? "body2" : "body1"}
                                >
                                    {language === 'en'
                                        ? 'No CSV files found.'
                                        : 'Nenašli sa žiadne CSV súbory.'}
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </Box>

            {/* Náhľad TXT súboru v modálnom okne */}
            {previewContentTXT && (
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
                            onClick={handleClosePreviewTXT}
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
                                {language === 'en' ? 'Preview of' : 'Náhľad súboru'} {selectedFileTXT}
                            </Typography>
                            <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {previewContentTXT}
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
                                disabled={processingTXT || !selectedFileTXT}>
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {processingTXT
                                        ? (language === 'en' ? 'Creating CSV...' : 'Vytvára sa CSV...')
                                        : (csvCreatedTXT
                                            ? (language === 'en' ? 'CSV Created' : 'CSV vytvorené')
                                            : (language === 'en' ? 'Create CSV' : 'Vytvoriť CSV'))}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Náhľad obsahu CSV súboru (v modálnom okne) */}
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
                    }}
                >
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
                        }}
                    >
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                zIndex: 1001
                            }}
                            onClick={handleClosePreview}
                            color="error"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: 2
                            }}
                        >
                            <Typography
                                variant={isSmallScreen ? "h7" : "h6"}
                                sx={{ fontWeight: 'bold', marginBottom: 2 }}
                            >
                                {language === 'en'
                                    ? 'Preview of'
                                    : 'Náhľad súboru'}{' '}
                                {processing ? selectedFileProcessing : selectedFile}
                            </Typography>
                            <Typography
                                variant={isSmallScreen ? "body2" : "body1"}
                                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
                                {processing
                                    ? previewContentProcessing
                                    : previewContent}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                                padding: '8px 16px',
                                display: 'flex',
                                justifyContent: 'center',
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Button
                                variant="outlined"
                                endIcon={<PlayArrowIcon />}
                                color="success"
                                onClick={handleOpenConfirm}
                                disabled={
                                    processing ||
                                    !selectedFile ||
                                    (processing && selectedFile !== selectedFileProcessing)
                                }
                            >
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {processing
                                        ? language === 'en'
                                            ? 'Processing...'
                                            : 'Spracováva sa...'
                                        : language === 'en'
                                            ? 'Process'
                                            : 'Spracovať'}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Potvrdzovací dialóg pre výber ChatGPT/Gemini */}
            <ConfirmationDialog
                open={confirmOpen}
                handleClose={handleCloseConfirm}
                handleProcessChatGPT={handleProcessChatGPT}
                handleProcessGemini={handleProcessGemini}
                language={language}
            />

            {/* Zobrazenie spracovaných výsledkov a tlačidla na vytvorenie CSV */}
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
                    }}
                >
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
                        }}
                    >
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                zIndex: 1001
                            }}
                            onClick={handleClosePreviewFinal}
                            color="error"
                        >
                            <CloseIcon />
                        </IconButton>

                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: 2
                            }}
                        >
                            <Typography
                                variant={isSmallScreen ? "h7" : "h6"}
                                sx={{ fontWeight: 'bold', marginBottom: 2 }}
                            >
                                {language === 'en'
                                    ? 'Processed Results for'
                                    : 'Spracované výsledky pre'}{' '}
                                {selectedFile}
                            </Typography>
                            <Typography
                                variant={isSmallScreen ? "body2" : "body1"}
                                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
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
                            }}
                        >
                            <Button
                                variant="outlined"
                                endIcon={<PlayArrowIcon />}
                                color="success"
                                onClick={handleCreateCsv}
                                disabled={isCreating}
                            >
                                <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                    {isCreating
                                        ? language === 'en'
                                            ? 'Creating CSV...'
                                            : 'Vytvára sa CSV...'
                                        : csvCreated
                                            ? language === 'en'
                                                ? 'CSV Created'
                                                : 'CSV Vytvorené'
                                            : language === 'en'
                                                ? 'Create CSV'
                                                : 'Vytvoriť CSV'}
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Zobrazenie draggable loaderu počas spracovania */}
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
                            <>
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
                            </>
                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                {language === 'en'
                                    ? 'Processing file:'
                                    : 'Spracováva sa súbor:'}{' '}
                                {processingFile}
                            </Typography>
                        </Box>
                    </Draggable>
                </Box>
            )}

            {/* CONFIRM DIALÓG pre zmazanie súboru */}
            <Dialog open={confirmOpenDelete} onClose={handleCloseConfirmDelete}>
                <DialogTitle>
                    {language === 'en'
                        ? 'Delete File'
                        : 'Odstrániť súbor'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {language === 'en'
                            ? `Are you sure you want to delete the file "${deleteFileName}"?`
                            : `Ste si istí, že chcete odstrániť súbor "${deleteFileName}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDelete} sx={{ color: theme => theme.palette.grey[800] }}>
                        {language === 'en' ? 'Cancel' : 'Zrušiť'}
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        {language === 'en' ? 'Delete' : 'Odstrániť'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* CONFIRM DIALÓG pre stiahnutie vygenerovaného CSV */}
            <Dialog
                open={confirmOpenDownload}
                onClose={handleCloseConfirmDownload}
            >
                <DialogTitle>
                    {language === 'en'
                        ? 'Download File'
                        : 'Stiahnuť súbor'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {language === 'en'
                            ? `Are you sure you want to download the file "${selectedFileDownload}"?`
                            : `Ste si istí, že chcete stiahnuť súbor "${selectedFileDownload}"?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDownload} sx={{ color: theme => theme.palette.grey[800] }}>
                        {language === 'en' ? 'Cancel' : 'Zrušiť'}
                    </Button>
                    <Button onClick={handleDownload} color="success" autoFocus>
                        {language === 'en' ? 'Download' : 'Stiahnuť'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FileList;