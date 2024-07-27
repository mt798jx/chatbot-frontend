import './App.css';
import { useState, useCallback } from "react";
import Chatbox from "./components/chat/ChatBox";
import FileUpload from "./components/file/FileUpload";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import GeneratedList from "./components/file/GeneratedList";

function App() {
    const [showChat, setShowChat] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleProcessingComplete = useCallback(() => {
        setRefreshTrigger(prev => !prev);
    }, []);

    const handleCsvCreated = useCallback(() => {
        setCsvRefreshTrigger(prev => !prev);
    }, []);

    return (
        <div className="App">
            <h1>Mirko's App with ChatBot</h1>

            <div className="content">
                <FileList onProcessingComplete={handleProcessingComplete} refreshTrigger={refreshTrigger} onCsvCreated={handleCsvCreated}/>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                <TxtList refreshTrigger={refreshTrigger} onCsvCreated={handleCsvCreated} />
                <GeneratedList refreshTrigger={csvRefreshTrigger} />
            </div>

            {showChat ? (
                <div className="content">
                    <Chatbox toggleChatVisibility={toggleChatVisibility} />
                </div>
            ) : (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    💬
                </button>
            )}
        </div>
    );
}

export default App;