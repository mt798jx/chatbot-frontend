import './App.css';
import { useState, useCallback } from "react";
import Chatbox from "./components/chat/ChatBox";
import FileUpload from "./components/file/FileUpload";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";
import GeneratedList from "./components/file/GeneratedList";

function App() {
    const [showChat, setShowChat] = useState(false);
    const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(false);
    const [csvRefreshTrigger, setCsvRefreshTrigger] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    const handleUploadSuccess = () => {
        setFileListRefreshTrigger(prev => !prev);
    };

    const handleProcessingComplete = useCallback(() => {
        setFileListRefreshTrigger(prev => !prev);
    }, []);

    const handleCsvCreated = useCallback(() => {
        setCsvRefreshTrigger(prev => !prev);
    }, []);

    return (
        <div className="App">
            <h1>Mirko's App with ChatBot</h1>

            <div className="content">
                <FileList onProcessingComplete={handleProcessingComplete} refreshTrigger={fileListRefreshTrigger} onCsvCreated={handleCsvCreated}/>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                <TxtList refreshTrigger={csvRefreshTrigger} onCsvCreated={handleCsvCreated} />
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