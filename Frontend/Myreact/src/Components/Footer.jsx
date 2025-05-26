import React from 'react';
import './Css/Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-stars">
        <div className="star" style={{ top: '10%', left: '15%' }}></div>
        <div className="star" style={{ top: '30%', left: '80%' }}></div>
        <div className="star" style={{ top: '60%', left: '50%' }}></div>
      </div>

      <div className="footer-blobs">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
      </div>

      <div className="footer-container">
        <div className="footer-logo">DocuIntel<span style={{ color: '#f1b814' }}>!</span></div>
        <div className="footer-links">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">About Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-bottom">
          © 2025 DocuIntel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
