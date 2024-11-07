import React, { useEffect, useState } from 'react';
import io from "socket.io-client";

// Connect to the server with socket.io
const socket = io("https://chat-api-self-seven.vercel.app/", {
    transports: ["websocket", "polling"]
});

const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for incoming messages
        socket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Clean up when component unmounts
        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("sendMessage", message);
            setMessage("");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat</h2>
            <div style={{ border: "1px solid #ddd", padding: "10px", maxHeight: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ padding: "5px 0" }}>
                        {msg}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    style={{ width: "80%", padding: "10px" }}
                />
                <button onClick={sendMessage} style={{ padding: "10px 20px", marginLeft: "5px" }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
