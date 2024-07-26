import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isLabelDisabled, setIsLabelDisabled] = useState(false);

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
                setMessage(result);
                setSelectedFile(null);
                document.getElementById('file-upload').value = '';

                setIsLabelDisabled(true);
                setTimeout(() => {
                    setMessage('');
                    setIsLabelDisabled(false);
                }, 3000);
            } else {
                const errorText = await response.text();
                setMessage(`File upload failed: ${errorText}`);
            }
        } catch (error) {
            setMessage('Error uploading file');
        }
    };

    const getMessageClass = () => {
        if (message === 'No file selected.') return 'warning';
        if (message.startsWith('File upload failed') || message === 'Error uploading file') return 'error';
        return 'success';
    };

    return (
        <div className="file-upload-container">
            <form onSubmit={handleSubmit}>
                <div className="file-input-wrapper">
                    <input type="file" accept=".csv" onChange={handleFileChange} id="file-upload" disabled={isLabelDisabled}/>
                    <label htmlFor="file-upload" className={`file-upload-label ${isLabelDisabled ? 'disabled' : ''}`}>
                        {selectedFile ? selectedFile.name : 'Choose a CSV file'}
                    </label>
                </div>
                {message && <div className={`message ${getMessageClass()}`}>{message}</div>}
                <button type="submit" className="upload-button" disabled={isLabelDisabled}>
                    Upload
                </button>
            </form>
        </div>
    );
};

export default FileUpload;