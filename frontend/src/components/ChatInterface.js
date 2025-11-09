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
  const [socket, setSocket] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const initialScrollDone = useRef(false); // Fix: prevent auto scroll jump

  const receiverId = currentUser.role === 'client' ? consultation.lawyer._id : consultation.client._id;

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get(`/api/messages/${consultation._id}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [consultation._id]);

  useEffect(() => {
    fetchMessages();
    const newSocket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
    setSocket(newSocket);
    newSocket.emit('join_user_room', currentUser.id);
    
    newSocket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.off('new_message');
      newSocket.disconnect();
    };
  }, [fetchMessages, currentUser.id]);

  // --- FIXED: prevent "page jump" ---
  useEffect(() => {
    if (!messageEndRef.current) return;
    if (!initialScrollDone.current && messages.length > 0) {
      // Wait until the DOM fully paints before scrolling
      requestAnimationFrame(() => {
        messageEndRef.current.scrollIntoView({ behavior: 'auto' });
        initialScrollDone.current = true;
      });
    } else if (initialScrollDone.current) {
      // Smooth scroll for new messages only
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("File is too large (max 5MB).");
        return;
      }
      setFileToSend(file);
      setNewMessage(file.name);
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
        formData.append('content', '');
      } else {
        formData.append('content', newMessage);
      }
    } else {
      formData.append('content', newMessage);
    }

    try {
      const res = await api.post(`/api/messages/${consultation._id}`, formData, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' },
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
      setFileToSend(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch {
      toast.error("Failed to send message.");
    }
  };

  // --- Styles ---
  const chatContainerStyle = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    background: '#f0f2f5',
  };

  const messageListStyle = {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const messageWrapper = (isMine) => ({
    display: 'flex',
    justifyContent: isMine ? 'flex-end' : 'flex-start',
  });

  const bubbleStyle = (isMine) => ({
    backgroundColor: isMine ? '#0A2342' : '#ffffff',
    color: isMine ? '#ffffff' : '#111827',
    padding: '0.7rem 1rem',
    borderRadius: '18px',
    maxWidth: '70%',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    borderBottomRightRadius: isMine ? '4px' : '18px',
    borderBottomLeftRadius: isMine ? '18px' : '4px',
    fontSize: '0.95rem',
    wordBreak: 'break-word',
  });

  const fileLinkStyle = {
    display: 'block',
    marginTop: '0.4rem',
    fontWeight: '600',
    color: 'inherit',
    textDecoration: 'underline',
    fontSize: '0.9rem',
  };

  const inputAreaStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.8rem',
    borderTop: '1px solid #e5e7eb',
    background: '#fff',
  };

  const inputStyle = {
    flex: 1,
    padding: '0.7rem 1rem',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '1rem',
    margin: '0 0.5rem',
  };

  const attachButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#555',
    padding: '0.5rem',
  };

  const sendButtonStyle = {
    backgroundColor: '#0A2342',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  };

  if (loading) return <p>Loading chat...</p>;

  return (
    <div style={chatContainerStyle}>
      <div style={messageListStyle}>
        {messages.map((msg) => {
          const isMine = msg.sender._id === currentUser.id;
          return (
            <div key={msg._id} style={messageWrapper(isMine)}>
              <div style={bubbleStyle(isMine)}>
                {msg.content}
                {msg.fileUrl && (
                  <a
                    href={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/${msg.fileUrl.replace('backend/', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={fileLinkStyle}
                  >
                    📎 {msg.fileName}
                  </a>
                )}
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
          style={inputStyle}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={fileToSend ? 'Add a caption...' : 'Type a message...'}
        />
        <button type="submit" style={sendButtonStyle}>
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
