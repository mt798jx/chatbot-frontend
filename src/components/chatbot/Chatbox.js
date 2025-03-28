import React, { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';
import { fetchResult, fetchChatHistory, clearChatHistory } from '../file/services-react/_api/file-service';

function Chatbox({ toggleChatVisibility }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (input.trim() === "") return;

        const userMessage = { from: "user", text: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput("");

        setIsTyping(true);

        try {
            const response = await fetchResult(input);
            const botMessage = { from: "bot", text: response.data.answer };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching response:', error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const loadChatHistory = async () => {
        try {
            const response = await fetchChatHistory();
            console.log(response.data.history)
            if (Array.isArray(response.data.history)) {
                const historyMessages = response.data.history
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

    const handleNewChat = async () => {
        try {
            await clearChatHistory();
            loadChatHistory();
        } catch (error) {
            console.error("Error clearing chat history:", error);
        }
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <div className="chat-container">
            <div className="chat-header">
                <Typography variant="h6" className="chat-title">
                    <ChatIcon style={{ marginRight: "8px" }} /> ChatBot
                </Typography>
                <div>
                    <button className="chat-header-new-chat" onClick={handleNewChat}>
                        <RefreshIcon style={{ color: "white" }} />
                    </button>
                    <button className="chat-header-close" onClick={toggleChatVisibility}>
                        <CloseIcon style={{ color: "white" }} />
                    </button>
                </div>
            </div>
            <div className="messages">
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from}`}>
                        <div className="message-text">
                            <ReactMarkdown>
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="message bot typing-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                    <SendIcon />
                </button>
            </div>
        </div>
    )
}

export default Chatbox;