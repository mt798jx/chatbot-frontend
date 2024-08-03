import React from 'react';
import { IconButton, styled, useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://147.232.205.178:8443/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.text();
                    alert(result);
                    if (onUploadSuccess) onUploadSuccess();
                } else {
                    const errorText = await response.text();
                    alert(`File upload failed: ${errorText}`);
                }
            } catch (error) {
                alert('Error uploading file');
            }
        }
    };

    return (
        <div>
            <IconButton aria-label="upload"
                        component="label"
                        size={isSmallScreen ? "small" : "medium"}
            >
                <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileChange} />
                <CloudUploadIcon
                    color="success"
                    fontSize={isSmallScreen ? "small" : "medium"}
                />
            </IconButton>
        </div>
    );
};

export default FileUpload;