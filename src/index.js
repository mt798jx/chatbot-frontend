import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './components/page/LoginPage';
import usePersistedState from './hooks/usePersistedState';

const RootComponent = () => {
    const [loggedIn, setLoggedIn] = usePersistedState('loggedIn', false);
    const [language, setLanguage] = usePersistedState('language', 'sk');

    const handleLogout = () => {
        clearPersistedState();
        setLoggedIn(false);
    };

    const clearPersistedState = () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('language');
        localStorage.removeItem('selectedPage');
        localStorage.removeItem('darkMode');
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <RootComponent />
    </React.StrictMode>
);