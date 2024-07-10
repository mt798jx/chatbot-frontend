import './App.css';
import { useState } from "react";
import Chatbox from "./components/chat/ChatBox";

function App() {
    const [showChat, setShowChat] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    return (
        <div className="App">

            <div className="content">
                <h1>Mirko's App with ChatBot</h1>
            </div>

            {showChat ? (
                <Chatbox toggleChatVisibility={toggleChatVisibility}/>
            ) : (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    💬
                </button>
            )}
        </div>
    );
}

export default App;