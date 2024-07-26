import "./ChatBox.css";
import {fetchResult} from "../services-react/_api/chat-service";
import {useState} from "react";

function Chatbox({toggleChatVisibility }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

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

    return (
        <div className="chat-container">
            <div className="chat-header">
                💬ChatBot
                <button className="chat-header-minimalize" onClick={toggleChatVisibility}>
                    &#10005; {/* Unicode for "X" symbol */}
                </button>
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.from}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input type="text" value={input} onKeyPress={handleKeyPress} onChange={(e) => setInput(e.target.value)}
                       placeholder="Type your message..."/>
                <button onClick={handleSend}>↑</button>
            </div>
        </div>
    )
}

export default Chatbox;
