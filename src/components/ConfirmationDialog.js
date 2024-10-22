import React from 'react';
import { Box, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MemoryIcon from '@mui/icons-material/Memory';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmationDialog = ({ open, handleClose, handleProcessChatGPT, handleProcessGemini, language }) => {
    const isSmallScreen = useMediaQuery('(max-width:600px)');

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <Box sx={{ position: 'relative', padding: 2 }}>
                {/* Close Button */}
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
                            color="primary"
                            onClick={handleProcessChatGPT}
                            startIcon={<ChatIcon />}
                            sx={{ width: '40%', textTransform: 'none' }}
                        >
                            ChatGPT
                        </Button>

                        <Button
                            variant="outlined"
                            color="success"
                            onClick={handleProcessGemini}
                            startIcon={<MemoryIcon />}
                            sx={{ width: '40%', textTransform: 'none' }}
                        >
                            GeminiAI
                        </Button>
                    </Box>

                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={handleClose} color="error">
                        {language === 'en' ? 'Cancel' : 'Zrušiť'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default ConfirmationDialog;