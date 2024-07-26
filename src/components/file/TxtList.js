import React, { useEffect, useState } from 'react';
import { fetchTxt } from './file-service';
import './TxtList.css';

const TxtList = ({ refreshTrigger }) => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div className="txt-list-container">
            <h2>TXT Files</h2>
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
                                </li>
                            ))
                        ) : (
                            <p>No TXT files found.</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

export default TxtList;
