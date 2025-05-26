import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Css/Filechat.css';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';


const FileChat = () => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axiosInstance.post('/Upload_file', formData,{
        headers: {
             'Content-Type': 'multipart/form-data',
          },
      });
      setFileId(response.data.file_id);
      setMessages([{ sender: 'system', text: '📄 File uploaded successfully. Ask me anything about it!' }]);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('File upload failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    if (!fileId) {
      toast.error('Please upload a file first.');
      return;
    }

    const userMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/chat', {
        file_id: fileId,
        messages: [
          {
            role: 'user',
            content: userInput,
          },
        ],
      });

      const aiMessage = { sender: 'ai', text: response.data.messages.slice(-1)[0].content, };
      console.log("message:", aiMessage)
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error('Error getting response from AI.');
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">📚 Chat with Your Document</h2>

      <input type="file" onChange={handleFileChange} disabled={loading} />
      <button onClick={handleFileUpload} className="upload-btn" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload & Start Chat'}
      </button>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          className="input-box"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question about the file..."
          disabled={loading || !fileId}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="send-btn"
          disabled={loading || !fileId || !userInput.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FileChat;
