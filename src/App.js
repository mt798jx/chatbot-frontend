import './App.css';
import { useState, useCallback } from "react";
import Chatbox from "./components/chat/ChatBox";
import Test from "./components/test/Test";
import FileUpload from "./components/file/FileUpload";
import FileList from "./components/file/FileList";
import TxtList from "./components/file/TxtList";

function App() {
    const [showChat, setShowChat] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleProcessingComplete = useCallback(() => {
        setRefreshTrigger(prev => !prev);
    }, []);

    return (
        <div className="App">
            <h1>Mirko's App with ChatBot</h1>

            <div className="content">
                <FileList onProcessingComplete={handleProcessingComplete} refreshTrigger={refreshTrigger} />
                <FileUpload onUploadSuccess={handleUploadSuccess} />
                <TxtList refreshTrigger={refreshTrigger} />
            </div>

            {showChat ? (
                <div className="content">
                    <Test />
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