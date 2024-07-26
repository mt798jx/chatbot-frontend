import React, { useEffect, useState } from 'react';

const FileList = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // fetch files
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('https://147.232.205.178:8443/list');
                if (response.ok) {
                    const files = await response.json();
                    setFileList(files);
                    setError('');
                } else {
                    setError('Failed to load file list');
                }
            } catch (error) {
                setError('Error fetching file list');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
        const interval = setInterval(fetchFiles, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="file-list-container">
            <h2>Uploaded CSV Files</h2>
            {loading ? (
                <p>Loading files...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <ul>
                    {fileList.length > 0 ? (
                        fileList.map((file, index) => (
                            <li key={index}>{file}</li>
                        ))
                    ) : (
                        <p>No CSV files found.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default FileList;