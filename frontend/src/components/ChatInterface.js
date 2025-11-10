// frontend/src/components/ChatInterface.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- SVG Icons ---
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const ChatInterface = ({ consultation, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [fileToSend, setFileToSend] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const isInitialLoad = useRef(true);

  const receiverId = currentUser.role === 'client' ? consultation.lawyer._id : consultation.client._id;

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/api/messages/${consultation._id}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultation._id]);

  useEffect(() => {
    fetchMessages();
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
    setSocket(newSocket);
    
    newSocket.emit('join_user_room', currentUser._id);
    
    newSocket.on('new_message', (message) => {
      if (message.consultation === consultation._id) {
          setMessages((prev) => [...prev, message]);
      }
    });
    
    return () => {
      newSocket.off('new_message');
      newSocket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMessages, currentUser._id, consultation._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      if (isInitialLoad.current) {
        messageEndRef.current.scrollIntoView({ behavior: 'auto' });
        isInitialLoad.current = false;
      } else {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error("File is too large (max 5MB).");
        return;
      }
      setFileToSend(file);
      if (!newMessage) {
          setNewMessage(file.name);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileToSend) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('receiverId', receiverId);
    
    if (fileToSend) {
        formData.append('file', fileToSend);
        if (newMessage === fileToSend.name) {
            formData.append('content', ''); // Send file with no text
        } else {
            formData.append('content', newMessage); // Send file with a caption
        }
    } else {
        formData.append('content', newMessage); // Text-only message
    }

    try {
      const res = await api.post(`/api/messages/${consultation._id}`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });
      
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
      setFileToSend(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      toast.error("Failed to send message.");
    }
  };

  // --- STYLES ---
  const chatContainerStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
    backgroundColor: '#f0f2f5',
  };
  const messageListStyle = {
    flex: 1,
    padding: '1rem 2rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };
  const messageWrapperStyle = (isMine) => ({
    display: 'flex',
    justifyContent: isMine ? 'flex-end' : 'flex-start',
    marginBottom: '0.5rem'
  });
  const bubbleStyle = (isMine) => ({
    backgroundColor: isMine ? '#0A2342' : '#ffffff',
    color: isMine ? '#ffffff' : '#111827',
    padding: '0.8rem 1.2rem',
    borderRadius: '18px',
    borderTopRightRadius: isMine ? '4px' : '18px',
    borderTopLeftRadius: isMine ? '18px' : '4px',
    maxWidth: '70%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    wordBreak: 'break-word',
    fontSize: '0.95rem',
    lineHeight: '1.4'
  });
  
  // --- CRITICAL FIX: Removed duplicate 'display' key ---
  const fileLinkStyle = (isMine) => ({
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: isMine ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
    borderRadius: '8px',
    color: 'inherit',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });
  
  const timestampStyle = {
    fontSize: '0.7rem',
    marginTop: '0.4rem',
    textAlign: 'right',
    opacity: 0.7
  };

  const inputAreaStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #e5e7eb'
  };
  const inputStyle = {
    flex: 1,
    padding: '0.8rem 1.2rem',
    margin: '0 0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '999px',
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: '#f9fafb'
  };
  const attachButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center'
  };
  const sendButtonStyle = {
    backgroundColor: '#0A2342',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: (!newMessage.trim() && !fileToSend) ? 0.5 : 1,
    transition: 'opacity 0.2s'
  };

  if (loading) return <div style={{padding: '2rem', textAlign: 'center'}}>Loading chat...</div>;

  return (
    <div style={chatContainerStyle}>
      <div style={messageListStyle}>
        {messages.map((msg) => {
          const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
          const currentUserId = currentUser._id || currentUser.id;
          const isMine = senderId.toString() === currentUserId.toString();

          return (
            <div key={msg._id} style={messageWrapperStyle(isMine)}>
              <div style={bubbleStyle(isMine)}>
                {msg.content}
                {msg.fileUrl && (
                  <a
                    href={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/${msg.fileUrl.replace('backend/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={fileLinkStyle(isMine)}
                  >
                    <span style={{fontSize: '1.2rem'}}>📎</span>
                    {msg.fileName || 'Attachment'}
                  </a>
                )}
                <div style={timestampStyle}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <form style={inputAreaStyle} onSubmit={handleSend}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          style={attachButtonStyle}
          title="Attach file"
          onClick={() => fileInputRef.current.click()}
        >
          <PaperclipIcon />
        </button>
        
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={fileToSend ? `File: ${fileToSend.name}` : "Type a message..."}
          style={inputStyle}
        />
        
        <button 
            type="submit" 
            disabled={!newMessage.trim() && !fileToSend}
            style={sendButtonStyle}
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;