import './App.css';
import { useState } from "react";
import Chatbox from "./components/chat/ChatBox";
import Test from "./components/test/Test";

function App() {
    const [showChat, setShowChat] = useState(false);

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    return (
        <div className="App">
            <h1>Mirko's App with ChatBot</h1>

            <div className="content">
                <Test/>
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