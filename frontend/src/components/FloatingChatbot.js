// frontend/src/components/FloatingChatbot.js

import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- SVG Icons ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

// --- NEW: Helper function to convert markdown to HTML ---
const formatMessage = (text) => {
    let html = text;
    // 1. Convert **bold** to <strong>bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 2. Convert newlines (\n) to <br> tags
    html = html.replace(/\n/g, '<br />');
    return html;
};

const FloatingChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm Harshi's AI. How can I help you with general legal information?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (text) => {
        if (!text.trim() || isTyping) return;

        const userMessage = { sender: 'user', text };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await api.post('/api/ai/chat', {
                message: text,
                history: newMessages.slice(0, -1) 
            });

            const botResponse = { sender: 'bot', text: res.data.text };
            setMessages(prev => [...prev, botResponse]);

        } catch (err) {
            toast.error("Sorry, I'm having trouble connecting. Please try again.");
            console.error(err);
        } finally {
            setIsTyping(false);
        }
    };

    const quickReplies = ["What are my rights?", "Explain Criminal Law", "How do I file for divorce?"];

    // --- STYLES ---
    const chatButtonStyle = {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, #007AFF, #00C6FF)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        zIndex: 1000,
    };

    const chatWindowStyle = {
        position: 'fixed',
        bottom: '90px',
        right: '24px',
        width: '360px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
        transformOrigin: 'bottom right',
        transform: isOpen ? 'scale(1)' : 'scale(0.9)',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        zIndex: 1000,
    };

    const headerStyle = {
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
    };
    const headerTitleStyle = { margin: 0, color: '#1d1d1f', fontWeight: '600' };
    const messageListStyle = {
        flex: 1,
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    };
    const messageBubbleStyle = { padding: '0.75rem 1.25rem', borderRadius: '18px', maxWidth: '75%', lineHeight: '1.5' };
    const userMessageStyle = { ...messageBubbleStyle, backgroundColor: '#007AFF', color: 'white', alignSelf: 'flex-end', borderBottomRightRadius: '4px' };
    const botMessageStyle = { ...messageBubbleStyle, backgroundColor: 'rgba(255,255,255,0.5)', color: '#1d1d1f', alignSelf: 'flex-start', borderBottomLeftRadius: '4px' };
    const typingIndicatorStyle = { ...botMessageStyle, fontStyle: 'italic', color: '#555' };
    
    const quickReplyContainerStyle = { padding: '0 1.5rem 1rem 1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' };
    const quickReplyButtonStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '999px',
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'rgba(255,255,255,0.2)',
        color: '#007AFF',
        cursor: 'pointer',
        fontSize: '0.9rem',
    };
    
    const inputAreaStyle = { display: 'flex', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.3)', gap: '0.5rem' };
    const inputStyle = { flex: 1, padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' };
    const sendButtonStyle = { padding: '0.75rem', border: 'none', borderRadius: '8px', backgroundColor: '#007AFF', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' };

    return (
        <>
            <button 
                style={chatButtonStyle} 
                onClick={() => setIsOpen(!isOpen)}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <ChatIcon />
            </button>
            <div style={chatWindowStyle}>
                <div style={headerStyle}><h3 style={headerTitleStyle}>Harshi's AI</h3></div>
                <div style={messageListStyle}>
                    {messages.map((msg, index) => (
                        // --- CRITICAL FIX: Use dangerouslySetInnerHTML to render HTML ---
                        <div 
                            key={index} 
                            style={msg.sender === 'user' ? userMessageStyle : botMessageStyle}
                            dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                        />
                    ))}
                    {isTyping && <div style={typingIndicatorStyle}>Harshi's AI is typing...</div>}
                </div>
                <div style={quickReplyContainerStyle}>
                    {messages.length === 1 && quickReplies.map(reply => (
                        <button key={reply} style={quickReplyButtonStyle} onClick={() => handleSend(reply)}>{reply}</button>
                    ))}
                </div>
                <div style={inputAreaStyle}>
                    <input 
                        type="text" 
                        style={inputStyle} 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Ask about Indian laws..." 
                        onKeyPress={(e) => e.key === 'Enter' && handleSend(e.target.value)} 
                    />
                    <button style={sendButtonStyle} onClick={() => handleSend(inputValue)} disabled={isTyping}>
                        <SendIcon />
                    </button>
                </div>
            </div>
        </>
    );
};

export default FloatingChatbot;