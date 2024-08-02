import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import './FileList.css';
import { fetchFiles } from "./file-service";
import { CircularProgress, Typography } from "@mui/material";

const FileList = ({ onProcessingComplete, refreshTrigger, onCsvCreated }) => {
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
                alert(`File deleted successfully: ${fileName}`);
                updateFileList();
            } else {
                setError('Failed to delete file');
            }
        } catch (error) {
            setError('Error deleting file');
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
                setError('Failed to fetch file preview');
            }
        } catch (error) {
            setError('Error fetching file preview');
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

    const handleProcess = async () => {
        if (processing) {
            return;
        }
        setProcessing(true);
        setProcessingFile(selectedFileProcessing);
        try {
            const encodedFileName = encodeURIComponent(selectedFileProcessing);
            const response = await fetch(`https://147.232.205.178:8443/process?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
                onProcessingComplete();
            } else {
                setError('Failed to process file');
            }
        } catch (error) {
            setError('Error processing file');
        } finally {
            setProcessing(false);
        }
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
                setCsvCreated(true);
                onCsvCreated();
                alert(`CSV file created: ${baseName}`);
                handleClosePreviewFinal();
            } else {
                setError('Failed to create CSV file');
            }
        } catch (error) {
            setError('Error creating CSV file');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="file-list-container">
            <Typography variant="h5" gutterBottom>
                Uploaded CSV Files
            </Typography>
            <div className="file-list-content">
                {loading ? (
                    <Typography>Loading files...</Typography>
                ) : error ? (
                    <Typography className="error">{error}</Typography>
                ) : (
                    <>
                        <ul>
                            {fileList.length > 0 ? (
                                fileList.map((file, index) => (
                                    <li key={index} className="file-item">
                                        <Typography className="file-name">{file}</Typography>
                                        <div className="button-group">
                                            <button className="preview-button"
                                                    onClick={() => handlePreview(file)}>
                                                👁️
                                            </button>
                                            <button className="delete-button"
                                                    onClick={() => handleDelete(file)}
                                                    disabled={processing && file === processingFile}>
                                                &#10005;
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <Typography>No CSV files found.</Typography>
                            )}
                        </ul>
                    </>
                )}
            </div>

            {(previewContent || previewContentProcessing) && (
                <div className="preview-modal">
                    <div className="preview-content">
                        <Typography variant="h6">
                            Preview of {processing ? selectedFileProcessing : selectedFile}
                        </Typography>
                        <pre>{processing ? previewContentProcessing : previewContent}</pre>
                        <div className="preview-buttons">
                            <button className="exit-button" onClick={handleClosePreview}>
                                Exit
                            </button>
                            <button className="process-button" onClick={handleProcess}
                                    disabled={processing || !selectedFile || (processing && selectedFile !== selectedFileProcessing)}>
                                {processing ? 'Processing...' : 'Process'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {processResults && (
                <div className="preview-modal">
                    <div className="preview-content">
                        <Typography variant="h6">
                            Processed Results for {selectedFile}
                        </Typography>
                        <pre>{processResults}</pre>
                        <div className="preview-buttons">
                            <button className="exit-button" onClick={handleClosePreviewFinal}>
                                Exit
                            </button>
                            <button className="process-button" onClick={handleCreateCsv}
                                    disabled={isCreating}>
                                {isCreating ? 'Creating CSV...' : csvCreated ? 'CSV Created' : 'Create CSV'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {processing && (
                <div className="processing-container">
                    <Draggable>
                        <div className="processing-indicator">
                            <React.Fragment>
                                <svg width={0} height={0}>
                                    <defs>
                                        <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#e01cd5"/>
                                            <stop offset="100%" stopColor="#1CB5E0"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <CircularProgress disableShrink
                                                  size={55}
                                                  thickness={4}
                                                  sx={{'svg circle': {stroke: 'url(#my_gradient)'}}}/>
                            </React.Fragment>
                            <Typography>Processing file: {processingFile}</Typography>
                        </div>
                    </Draggable>
                </div>
            )}
        </div>
    );
};

export default FileList;