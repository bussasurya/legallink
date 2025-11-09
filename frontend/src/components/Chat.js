// frontend/src/components/Chat.js

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend server
const socket = io.connect(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

const Chat = ({ room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: "You", // In a real app, this would be the user's name
                message: currentMessage,
                time: new Date(Date.now()).toLocaleTimeString(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        // Join the room when the component mounts
        socket.emit("join_room", room);

        const handleReceiveMessage = (data) => {
            // To avoid showing your own message twice, you could add a check here
            // For now, we'll assume the author is different
            data.author = "Lawyer"; // Or "Client"
            setMessageList((list) => [...list, data]);
        };
        
        // Listen for incoming messages
        socket.on("receive_message", handleReceiveMessage);

        // Clean up the event listener when the component unmounts
        return () => socket.off("receive_message", handleReceiveMessage);
    }, [room]);


    // --- STYLES ---
    const chatWindowStyle = { width: '100%', height: '400px', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden' };
    const chatHeaderStyle = { backgroundColor: '#0A2342', color: 'white', padding: '10px', textAlign: 'center' };
    const chatBodyStyle = { flex: '1', padding: '10px', overflowY: 'auto', backgroundColor: '#f9f9f9' };
    const chatFooterStyle = { padding: '10px', display: 'flex', borderTop: '1px solid #ccc' };
    const inputStyle = { flex: '1', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' };
    const sendButtonStyle = { padding: '8px 12px', marginLeft: '10px', border: 'none', backgroundColor: '#0A2342', color: 'white', borderRadius: '5px', cursor: 'pointer' };
    const messageStyle = { marginBottom: '10px', padding: '8px', borderRadius: '5px' };
    const authorStyle = { fontWeight: 'bold' };

    return (
        <div style={chatWindowStyle}>
            <div style={chatHeaderStyle}>
                <h3 style={{margin: 0}}>Live Chat</h3>
            </div>
            <div style={chatBodyStyle}>
                {messageList.map((msg, index) => (
                    <div key={index} style={{...messageStyle, textAlign: msg.author === "You" ? 'right' : 'left'}}>
                        <div style={{
                            backgroundColor: msg.author === "You" ? '#D4AF37' : '#EAEAEA',
                            color: msg.author === "You" ? '#0A2342' : '#000',
                            padding: '8px 12px',
                            borderRadius: '10px',
                            display: 'inline-block',
                            maxWidth: '80%'
                        }}>
                            <p style={{...authorStyle, margin: '0 0 5px 0'}}>{msg.author}</p>
                            <p style={{margin: 0}}>{msg.message}</p>
                            <p style={{fontSize: '0.7rem', margin: '5px 0 0 0', textAlign: 'right', color: msg.author === "You" ? '#555' : '#888'}}>{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div style={chatFooterStyle}>
                <input 
                    type="text" 
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    style={inputStyle}
                    placeholder="Type a message..." 
                />
                <button onClick={sendMessage} style={sendButtonStyle}>Send</button>
            </div>
        </div>
    );
};

export default Chat;