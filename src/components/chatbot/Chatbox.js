import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import './Chatbot.css';
import { fetchResult, fetchChatHistory } from '../file/services-react/_api/file-service';

function Chatbox({ toggleChatVisibility }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { from: "user", text: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await fetchResult(input);
            const botMessage = { from: "bot", text: response.data };
            setMessages(prevMessages => [...prevMessages, botMessage]);
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

    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await fetchChatHistory();
                if (Array.isArray(response.data)) {
                    const historyMessages = response.data
                        .filter(msg => msg.role !== "system")
                        .map(msg => ({
                            from: msg.role,
                            text: msg.content
                        }));
                    setMessages(historyMessages);
                }
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        };
        loadChatHistory();
    }, []);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <Typography variant="h6" className="chat-title">
                    <span role="img" aria-label="Chat">💭</span> ChatBot
                </Typography>
                <button className="chat-header-close" onClick={toggleChatVisibility}>✖</button>
            </div>
            <div className="messages">
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from}`}>
                        <Typography variant="body1" className="message-text">
                            {msg.text}
                        </Typography>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>↑</button>
            </div>
        </div>
    )
}

export default Chatbox;