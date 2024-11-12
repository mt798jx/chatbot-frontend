import React from 'react';
import { IconButton, styled, useMediaQuery } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUpload = ({ onUploadSuccess, language }) => {
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
        const files = event.target.files;
        if (files.length > 0) {
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i]);
            }

            try {
                const response = await fetch('https://100.119.248.77:8445/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const successMessage = language === 'en'
                        ? `Files have been successfully uploaded.`
                        : `Súbory boli úspešne nahrané.`;
                    alert(successMessage);
                    if (onUploadSuccess) onUploadSuccess();
                } else {
                    const failureMessage = language === 'en'
                        ? "File upload failed."
                        : "Nahrávanie súborov zlyhalo.";
                    alert(failureMessage);
                }
            } catch (error) {
                const errorMessage = language === 'en'
                    ? 'Error uploading files.'
                    : 'Chyba pri nahrávaní súborov.';
                alert(errorMessage);
            }
        }
    };

    return (
        <>
            <IconButton aria-label="upload"
                        component="label"
                        size={isSmallScreen ? "small" : "medium"}
            >
                <VisuallyHiddenInput type="file" accept=".csv" multiple onChange={handleFileChange} />
                <CloudUploadIcon
                    color="success"
                    fontSize={isSmallScreen ? "small" : "medium"}
                />
            </IconButton>
        </>
    );
};

export default FileUpload;