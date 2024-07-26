import './App.css';
import { useState } from "react";
import Chatbox from "./components/chat/ChatBox";
import Test from "./components/test/Test";
import FileUpload from "./components/file/FileUpload";
import FileList from "./components/file/FileList";

function App() {
    const [showChat, setShowChat] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    return (
        <div className="App">
            <h1>Mirko's App with ChatBot</h1>

            <div className="content">
                <FileList/>
                <FileUpload/>
            </div>

            {showChat ? (
                    <div className="content">
                        <Test/>
                        <Chatbox toggleChatVisibility={toggleChatVisibility}/>
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