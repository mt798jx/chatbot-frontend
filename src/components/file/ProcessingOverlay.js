import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Fade, useTheme } from "@mui/material";

const ProcessingOverlay = ({ processing, processingFile, language }) => {
    const theme = useTheme();

    useEffect(() => {
        if (processing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [processing]);

    if (!processing) return null;

    return (
        <Fade in={processing}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1300,
                    backdropFilter: 'blur(5px)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        padding: theme.spacing(4),
                        borderRadius: 2,
                        boxShadow: 24,
                        textAlign: 'center',
                        maxWidth: 400,
                        width: '90%',
                        animation: 'pulse 2s infinite',
                    }}
                >
                    {/* Gradient Circular Progress */}
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={80}
                            thickness={4}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.3)',
                            }}
                        />
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            size={80}
                            thickness={4}
                            sx={{
                                position: 'absolute',
                                left: 0,
                                color: 'primary.main',
                                animationDuration: '550ms',
                            }}
                        />
                    </Box>

                    {/* Spracovávaný súbor */}
                    <Typography variant="h6" gutterBottom>
                        {language === 'en' ? 'Processing File:' : 'Spracováva sa súbor:'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {processingFile}
                    </Typography>

                    {/* Spinner s textom */}
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {language === 'en' ? 'Please wait...' : 'Prosím, čakajte...'}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};

export default ProcessingOverlay;