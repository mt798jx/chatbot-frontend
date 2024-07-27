import React, { useEffect, useState } from 'react';
import {fetchCsv} from './file-service';
import './GeneratedList.css';

const GeneratedList = ({ refreshTrigger }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleAction = (fileName) => {

        alert(`Action on file: ${fileName}`);
    };

    return (
        <div className="generated-list-container">
            <h2>Generated CSV Files</h2>
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
                                        <button className="action-button" onClick={() => handleAction(file)}>
                                            Download
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p>No CSV files found.</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default GeneratedList;