import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import './FileUpload.css';
import { useMediaQuery } from "@mui/material";

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setSelectedFile(file);
            setMessage('');
        } else {
            setMessage('Please select a valid CSV file.');
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setMessage('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('https://147.232.205.178:8443/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.text();
                alert(result);
                setSelectedFile(null);
                document.getElementById('file-upload').value = '';

                if (onUploadSuccess) onUploadSuccess();
            } else {
                const errorText = await response.text();
                setMessage(`File upload failed: ${errorText}`);
            }
        } catch (error) {
            setMessage('Error uploading file');
        }
    };

    return (
        <div className="file-list-container">
            <form onSubmit={handleSubmit}>
                <div className="file-input-wrapper">
                    <input type="file" accept=".csv" onChange={handleFileChange} id="file-upload" />
                    <label htmlFor="file-upload" className="file-upload-label">
                        <Typography variant={isSmallScreen ? "body2" : "body1"}>
                            {selectedFile ? selectedFile.name : 'Choose a CSV file'}
                        </Typography>
                    </label>
                </div>
                {message && (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>
                        {message}
                    </Typography>
                )}
                <button type="submit" className="upload-button" disabled={!selectedFile}>
                    Upload
                </button>
            </form>
        </div>
    );
};

export default FileUpload;