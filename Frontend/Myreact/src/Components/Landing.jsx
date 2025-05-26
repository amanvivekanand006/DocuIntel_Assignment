import React, { useRef, useEffect } from 'react'; 
import './Css/Landing.css';
import docImage from './Images/Laptop.jpg'; 

const LandingPage = () => {
  const videoRef = useRef(); 

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 4.0;
    }
  }, []);

  return (
    <div className="landing-container">
      <div className="text-section">
        <h1>DocuIntel</h1>
        <h2>Intelligent Document Insights Platform</h2>
        <p className="quote">"Empowering decisions through smart document analysis."</p>
        <p className="description">
          DocuIntel is a cutting-edge platform that analyzes and interprets your documents intelligently. 
          Whether it's contracts, reports, or scanned files, DocuIntel extracts key insights and helps you 
          make informed decisions faster with AI-powered summarization, categorization, and search.
        </p>
      </div>
      <div className="image-section">
        <video
          ref={videoRef} 
          src="/Videos/landing.mp4"
          autoPlay
          muted
          playsInline
          loop={true}
          className="video-element"
        />
      </div>
    </div>
  );
};

export default LandingPage;
