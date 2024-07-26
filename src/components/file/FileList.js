import React, { useEffect, useState } from 'react';
import { fetchFiles } from './file-service';

const FileList = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        updateFileList(); // Fetch files initially
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
                            <li key={index}>
                                {file}
                                <button onClick={() => handleDelete(file)}>Delete</button>
                            </li>
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