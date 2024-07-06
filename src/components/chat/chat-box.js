import "./chat-box.css";

function Chatbox({ messages, input, setInput, handleSend, handleKeyPress, toggleChatVisibility }) {
    return (
        <div className="chat-container">
            <div className="chat-header">
                💬ChatBot
                <button className="chat-header-minimalize icon-button" onClick={toggleChatVisibility}>-</button>
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
