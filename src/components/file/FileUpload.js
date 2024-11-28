import React, { useState, useRef } from 'react';
import { Box, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const FileUpload = ({ onUploadSuccess, language }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(0);
        const droppedFiles = Array.from(event.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = () => setIsDragging((count) => count + 1);

    const handleDragLeave = () => setIsDragging((count) => Math.max(0, count - 1));

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const clearFiles = () => {
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadSingleFile = async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://100.119.248.77:8445/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const successMessage = language === 'en'
                    ? `File "${file.name}" has been successfully uploaded.`
                    : `Súbor "${file.name}" bol úspešne nahraný.`;
                alert(successMessage);
                removeFile(index);
                if (onUploadSuccess) onUploadSuccess();
            } else {
                const failureMessage = language === 'en'
                    ? `File "${file.name}" upload failed.`
                    : `Nahrávanie súboru "${file.name}" zlyhalo.`;
                alert(failureMessage);
            }
        } catch (error) {
            const errorMessage = language === 'en'
                ? `Error uploading file "${file.name}".`
                : `Chyba pri nahrávaní súboru "${file.name}".`;
            alert(errorMessage);
        }
    };

    const uploadAllFiles = async () => {
        if (files.length > 0) {
            const formData = new FormData();

            files.forEach((file) => formData.append('file', file));

            try {
                const response = await fetch('https://100.119.248.77:8445/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const successMessage = language === 'en'
                        ? `All files have been successfully uploaded.`
                        : `Všetky súbory boli úspešne nahrané.`;
                    alert(successMessage);
                    clearFiles();
                    if (onUploadSuccess) onUploadSuccess();
                } else {
                    const failureMessage = language === 'en'
                        ? "Uploading all files failed."
                        : "Nahrávanie všetkých súborov zlyhalo.";
                    alert(failureMessage);
                }
            } catch (error) {
                const errorMessage = language === 'en'
                    ? 'Error uploading all files.'
                    : 'Chyba pri nahrávaní všetkých súborov.';
                alert(errorMessage);
            }
        }
    };

    return (
        <Box
            sx={{
                border: '2px dashed #4caf50',
                borderRadius: '8px',
                p: 2,
                textAlign: 'center',
                backgroundColor: isDragging > 0 ? '#d0f0c0' : undefined,
                color: isDragging > 0 ? '#000' : undefined,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <Typography variant="body1" sx={{ mb: 2 }}>
                {language === 'en' ? 'Drag and drop files here or click to upload.' : 'Presuňte súbory sem alebo kliknite na nahranie.'}
            </Typography>
            <Button
                variant="contained"
                component="label"
                size={isSmallScreen ? "small" : "medium"}
                sx={{ mb: 2 }}
            >
                {language === 'en' ? 'Choose Files' : 'Vybrať súbory'}
                <input
                    type="file"
                    hidden
                    multiple
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </Button>
            {files.length > 0 && (
                <Box>
                    <List
                        sx={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    >
                        {files.map((file, index) => (
                            <ListItem key={index} sx={{ borderBottom: '1px solid #ccc' }}>
                                <ListItemText primary={file.name} />
                                <ListItemSecondaryAction>
                                    <div className="button-group">
                                        <IconButton aria-label="edit" size="small" onClick={() => uploadSingleFile(file, index)}>
                                            <CloudUploadIcon color="primary" fontSize="inherit"/>
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            size="small"
                                            onClick={() => removeFile(index)}>
                                            <DeleteForeverIcon color="error"
                                                               fontSize={isSmallScreen ? "inherit" : "small"}/>
                                        </IconButton>
                                    </div>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="error" onClick={clearFiles} sx={{ mr: 2 }}>
                            {language === 'en' ? 'Clear All' : 'Vymazať všetko'}
                        </Button>
                        <Button variant="contained" color="primary" onClick={uploadAllFiles}>
                            {language === 'en' ? 'Upload All' : 'Nahrať všetko'}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default FileUpload;