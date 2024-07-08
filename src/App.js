import './App.css';
import { useState } from "react";
import { fetchResult } from "./components/services-react/_api/chat-service";
import Chatbox from "./components/chat/ChatBox";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showChat, setShowChat] = useState(false);

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { from: "user", text: input };
        setMessages(prevMessages => {
            return [...prevMessages, userMessage];
        });

        try {
            const response = await fetchResult(input);
            const botMessage = { from: "bot", text: response.data };
            setMessages(prevMessages => {
                return [...prevMessages, botMessage];
            });
        } catch (error) {
            console.error('Error fetching response:', error);
        }
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const toggleChatVisibility = () => {
        setShowChat(!showChat);
    };

    return (
        <div className="App">

            <div className="content">
                <h1>Mirko's App with ChatBot</h1>
            </div>

            {showChat ? (
                <Chatbox messages={messages} input={input} setInput={setInput} handleKeyPress={handleKeyPress} toggleChatVisibility={toggleChatVisibility}/>
            ) : (
                <button className="chat-toggle-button" onClick={toggleChatVisibility}>
                    💬
                </button>
            )}
        </div>
    );
}

export default App;