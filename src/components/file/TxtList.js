import React, { useEffect, useState } from 'react';
import { fetchTxt } from '../services-react/_api/file-service';
import './TxtList.css';
import {Typography, useMediaQuery} from '@mui/material';

const TxtList = ({ refreshTrigger, onCsvCreated }) => {
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
                setError('Failed to fetch file preview');
            }
        } catch (error) {
            setError('Error fetching file preview');
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
                alert(`CSV file created: ${baseName}.csv`);
                handleClosePreview();
            } else {
                setError('Failed to create CSV file');
            }
        } catch (error) {
            setError('Error creating CSV file');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="file-list-container">
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                Created TXT Files
            </Typography>
            <div className="file-list-content">
                {loading ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"}>Loading files...</Typography>
                ) : error ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} className="error">{error}</Typography>
                ) : (
                    <>
                        <div className="file-list">
                            <ul>
                                {fileList.length > 0 ? (
                                    fileList.map((file, index) => (
                                        <li key={index}>
                                            <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">{file}</Typography>
                                            <div className="button-group">
                                                <button className="preview-button" onClick={() => handlePreview(file)}>
                                                    👁️
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <Typography variant={isSmallScreen ? "body2" : "body1"}>No TXT files found.</Typography>
                                )}
                            </ul>
                        </div>

                        {previewContent && (
                            <div className="preview-modal">
                                <div className="preview-content">
                                    <Typography variant={isSmallScreen ? "h7" : "h6"}>
                                        Preview of {selectedFile}
                                    </Typography>
                                    <pre>{previewContent}</pre>
                                    <div className="preview-buttons">
                                        <button className="exit-button" onClick={handleClosePreview}>
                                            Exit
                                        </button>
                                        <button className="process-button" onClick={handleProcess} disabled={processing || !selectedFile}>
                                            {processing ? 'Creating CSV...' : (csvCreated ? 'CSV Created' : 'Create CSV')}
                                        </button>
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