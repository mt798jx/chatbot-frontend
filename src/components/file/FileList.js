import React, { useEffect, useState } from 'react';
import { fetchFiles } from './file-service';
import './FileList.css';

const FileList = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [previewContent, setPreviewContent] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
    const [processResults, setProcessResults] = useState(null);
    const [processing, setProcessing] = useState(false);

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
    }, []);

    const handleDelete = async (fileName) => {
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
        setProcessResults(null);
    };

    const handleProcess = async () => {
        if (processing) {
            return;
        }
        setProcessing(true);
        try {
            const encodedFileName = encodeURIComponent(selectedFile);
            const response = await fetch(`https://147.232.205.178:8443/process?fileName=${encodedFileName}`);
            if (response.ok) {
                const content = await response.json();
                setProcessResults(content);
            } else {
                setError('Failed to process file');
            }
        } catch (error) {
            setError('Error processing file');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="file-list-container">
            <h2>Uploaded CSV Files</h2>
            {loading ? (
                <p>Loading files...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <>
                    <ul>
                        {fileList.length > 0 ? (
                            fileList.map((file, index) => (
                                <li key={index} className="file-item">
                                    <span className="file-name">{file}</span>
                                    <div className="button-group">
                                        <button className="preview-button" onClick={() => handlePreview(file)}>
                                            👁️ {/* Unicode for "Eye" symbol */}
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(file)}>
                                            &#10005; {/* Unicode for "X" symbol */}
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No CSV files found.</p>
                        )}
                    </ul>

                    {previewContent && (
                        <div className="preview-modal">
                            <div className="preview-content">
                                <h3>Preview of {selectedFile}</h3>
                                <pre>{previewContent}</pre>
                                <div className="preview-buttons">
                                    <button onClick={handleClosePreview}>Exit</button>
                                    <button onClick={handleProcess} disabled={processing}>
                                        {processing ? 'Processing...' : 'Process'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {processResults && (
                        <div className="preview-modal">
                            <div className="preview-content">
                                <h3>Processing Results for {selectedFile}</h3>
                                <pre>{processResults}</pre>
                                <div className="preview-buttons">
                                    <button onClick={handleClosePreview}>Exit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {processing && (
                        <div className="processing-indicator">
                            <p>Processing in progress...</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FileList;