import React from 'react';
import './Css/UploadImage.css';
import laptop from './Images/start.jpg';
import { useNavigate } from 'react-router-dom';

const UploadImage = () => {
  const navigate = useNavigate();

  // Simulate login check (replace with real auth logic)
  const isLoggedIn = localStorage.getItem('access_token'); // or your auth logic

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/filechat');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="upload-container">
      <img src={laptop} alt="Laptop" className="background-image" />
      <div className="overlay-content">
        <h1 className="headline">Welcome to <span>DocuIntel</span></h1>
        <p className="subtext">Intelligent Document Insights Platform</p>
        <button className="get-started-btn" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default UploadImage;

