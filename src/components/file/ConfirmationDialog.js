import React from 'react';
import { Box, Button, Typography, Dialog, DialogContent, DialogTitle, useMediaQuery, IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MemoryIcon from '@mui/icons-material/Memory';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationDialog = ({ open, handleClose, handleProcessChatGPT, handleProcessGemini, language }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <Box sx={{ position: 'relative', padding: 2 }}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {language === 'en' ? 'Process File' : 'Spracovať súbor'}
                </DialogTitle>

                <DialogContent>
                    <Typography variant={isSmallScreen ? "body2" : "body1"} sx={{ textAlign: 'center', marginBottom: 2 }}>
                        {language === 'en' ? 'Select an AI system to process the file.' : 'Vyberte systém AI pre spracovanie súboru.'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button
                            variant="outlined"
                            onClick={handleProcessChatGPT}
                            startIcon={<ChatIcon />}
                            sx={{ width: '40%', textTransform: 'none', color: '#007bff' }}
                        >
                            ChatGPT
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleProcessGemini}
                            startIcon={<MemoryIcon />}
                            sx={{ width: '40%', textTransform: 'none', color: '#28a745' }}
                        >
                            GeminiAI
                        </Button>
                    </Box>

                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default ConfirmationDialog;