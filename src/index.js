import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './components/page/LoginPage';

const RootComponent = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [language, setLanguage] = useState('sk');

    // Načítanie stavu prihlásenia z localStorage pri mountnutí komponentu
    useEffect(() => {
        const storedLoginState = localStorage.getItem('loggedIn');
        if (storedLoginState === 'true') {
            setLoggedIn(true);
        }
    }, []);

    // Aktualizácia localStorage, keď sa stav prihlásenia zmení
    useEffect(() => {
        localStorage.setItem('loggedIn', loggedIn);
    }, [loggedIn]);

    // Funkcia na odhlásenie
    const handleLogout = () => {
        setLoggedIn(false);
    };

    if (!loggedIn) {
        return <LoginPage language={language} onLogin={() => setLoggedIn(true)} />;
    } else {
        return <App language={language} setLanguage={setLanguage} onLogout={handleLogout} />;
    }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <RootComponent />
    </React.StrictMode>
);