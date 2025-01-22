import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginPage from './components/LoginPage';

const RootComponent = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const language = 'sk';

    if (!loggedIn) return <LoginPage language={language} onLogin={() => setLoggedIn(true)} />;
    else return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <RootComponent />
    </React.StrictMode>
);
