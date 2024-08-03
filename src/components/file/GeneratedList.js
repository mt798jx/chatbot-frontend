import React, { useEffect, useState } from 'react';
import { fetchCsv } from '../services-react/_api/file-service';
import './GeneratedList.css';
import {IconButton, Typography, useMediaQuery} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const GeneratedList = ({ refreshTrigger, language }) => {
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

            if (!response.ok) {
                const errorMessage = language === 'en' ? 'Failed to fetch file' : 'Nepodarilo sa načítať súbor';
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            const successMessage = language === 'en'
                ? `File "${fileName}" has been successfully downloaded. Check your default downloads folder.`
                : `Súbor "${fileName}" bol úspešne stiahnutý. Skontrolujte svoj predvolený priečinok na sťahovanie.`;
            alert(successMessage);
        } catch (error) {
            const errorDownloadMessage = language === 'en' ? `Error downloading file: ${error.message}` : `Chyba pri sťahovaní súboru: ${error.message}`;
            setError(errorDownloadMessage);
        }
    };

    return (
        <div className="file-list-container">
            <Typography variant={isSmallScreen ? "h6" : "h5"} gutterBottom>
                {language === 'en' ? "Generated CSV Files" : "Výsledné CSV súbory"}
            </Typography>
            <div className="file-list-content">
                {loading ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'warning.main' }}>
                        {language === 'en' ? "Loading files..." : "Načítavajú sa súbory..."}
                    </Typography>
                ) : error ? (
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ color: 'error.main' }}>
                        {error}
                    </Typography>
                ) : (
                    <ul className="file-list">
                        {fileList.length > 0 ? (
                            fileList.map((file, index) => (
                                <li key={index}>
                                    <Typography variant={isSmallScreen ? "body2" : "body1"} className="file-name">
                                        {file}
                                    </Typography>
                                    <IconButton aria-label="download"
                                                size="small"
                                                className="icon-button"
                                                onClick={() => handleDownload(file)}>
                                        <DownloadIcon
                                            color="success"
                                            fontSize={isSmallScreen ? "inherit" : "small"}
                                        />
                                    </IconButton>
                                </li>
                            ))
                        ) : (
                            <Typography variant={isSmallScreen ? "body2" : "body1"}>
                                {language === 'en' ? "No CSV files found" : "Nenašli sa žiadne súbory CSV"}
                            </Typography>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default GeneratedList;