import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">Career Gateway</h3>
            <p className="footer-description">
              Comprehensive career assessments designed for B.Tech, M.Tech, MBA, BBA students and professionals.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/assessments">Assessments</a></li>
              <li><a href="/career-explorer">Career Explorer</a></li>
              <li><a href="/resources">Resources</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>Email: vamsiklu367@gmail.com</li>
              <li>Phone: 8688228176</li>
              <li>Address: Vijayawada, AP, India</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">LinkedIn</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Career Gateway. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;