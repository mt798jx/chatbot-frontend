import React, { useEffect, useState } from 'react';
import { fetchCsv } from '../services-react/_api/file-service';
import './GeneratedList.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Typography, useMediaQuery } from "@mui/material";

const GeneratedList = ({ refreshTrigger }) => {
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

            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            alert(`File "${fileName}" has been successfully downloaded. Check your default downloads folder.`);

        } catch (error) {
            setError(`Error downloading file: ${error.message}`);
        }
    };

    return (
        <div className="file-list-container">
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                Generated CSV Files
            </Typography>
            <div className="file-list-content">
                {loading ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>Loading files...</Typography>
                ) : error ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>{error}</Typography>
                ) : (
                    <ul className="file-list">
                        {fileList.length > 0 ? (
                            fileList.map((file, index) => (
                                <li key={index}>
                                    <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">{file}</Typography>
                                    <button className="download-button" onClick={() => handleDownload(file)}>
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <Typography variant={isSmallScreen ? "body2" : "body1"}>No CSV files found.</Typography>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default GeneratedList;