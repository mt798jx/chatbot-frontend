import React from 'react';
import { Box, Paper } from '@mui/material';
import FileUpload from '../file/FileUpload';
import FileList from '../file/FileList';
import TxtList from '../file/TxtList';

const HomePage = ({
                      language,
                      fileListRefreshTrigger,
                      handleFileListUpdate,
                      handleCsvCreated,
                  }) => {
    return (
        <>
            <Paper elevation={4} sx={{ margin: 2, padding: 2, borderRadius: 2 }}>
                <FileUpload onUploadSuccess={handleFileListUpdate} language={language} />
            </Paper>

            <Box className="content">
                <FileList
                    refreshTrigger={fileListRefreshTrigger}
                    onProcessingComplete={handleFileListUpdate}
                    onFileDeleted={handleFileListUpdate}
                    language={language}
                    onCsvCreated={handleCsvCreated}
                />
                <TxtList
                    refreshTrigger={fileListRefreshTrigger}
                    onCsvCreated={handleCsvCreated}
                    language={language}
                />
            </Box>
        </>
    );
};

export default HomePage;