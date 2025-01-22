import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Fade, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        mode: 'dark',
    },
});

const LoginPage = ({ language = 'en', onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const passwordRef = useRef(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === 'admin') {
            setError('');
            if (onLogin) onLogin();
        } else {
            setError(language === 'en' ? 'Invalid password' : 'Neplatné heslo');
        }
    };

    useEffect(() => {
        if (showForm && passwordRef.current) {
            passwordRef.current.focus();
        }
    }, [showForm]);

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #000000 0%, #222222 100%)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Fade in={!showForm} timeout={800}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: showForm ? 'default' : 'pointer',
                            position: 'absolute',
                        }}
                        onClick={() => { if (!showForm) setShowForm(true); }}
                    >
                        <Box
                            sx={{
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                border: '6px solid',
                                borderImage: 'linear-gradient(45deg, #ffffff, #888888) 1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 0 25px rgba(255,255,255,0.2)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 0 40px rgba(255,255,255,0.5)',
                                },
                            }}
                        >
                            <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                                admin
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2, color: '#ccc' }}>
                            {language === 'en' ? 'Click to sign in' : 'Kliknite pre prihlásenie'}
                        </Typography>
                    </Box>
                </Fade>

                {showForm && (
                    <Fade in={showForm} timeout={800}>
                        <Box
                            sx={{
                                width: '100vh',
                                maxWidth: 400,
                                px: 4,
                                py: 6,
                                backgroundColor: 'rgba(0,0,0,0.85)',
                                borderRadius: 2,
                                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                                zIndex: 1,
                                position: isMobile ? 'absolute' : 'static',
                                top: isMobile ? '10%' : 'auto',
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#fff' }}>
                                admin
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    variant="filled"
                                    margin="normal"
                                    fullWidth
                                    type="password"
                                    label={language === 'en' ? 'Password' : 'Heslo'}
                                    InputLabelProps={{ style: { color: '#888' } }}
                                    InputProps={{
                                        style: { color: '#fff', backgroundColor: '#333' },
                                    }}
                                    sx={{
                                        '& .MuiFilledInput-root': {
                                            borderRadius: 1,
                                        },
                                        mb: 2,
                                    }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    inputRef={passwordRef}
                                />
                                {error && (
                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                        {error}
                                    </Typography>
                                )}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        borderRadius: 1,
                                    }}
                                >
                                    {language === 'en' ? 'Sign In' : 'Prihlásiť sa'}
                                </Button>
                            </form>
                        </Box>
                    </Fade>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default LoginPage;