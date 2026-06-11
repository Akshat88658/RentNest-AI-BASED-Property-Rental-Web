import { Link } from 'react-router-dom';
import { FiTwitter, FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>🏠 RentNest</h2>
          <p>
            AI-powered premium rental property platform. Find your perfect home with intelligent search, smart filters, and real-time recommendations.
          </p>
          <div className="footer-social" style={{ marginTop: '1rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FiFacebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FiInstagram size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Product</h3>
          <ul>
            <li><Link to="/properties">Browse Properties</Link></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#mobile">Mobile App</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#status">System Status</a></li>
          </ul>
        </div>

        <div className="footer-section" style={{ minWidth: '220px' }}>
          <h3>Stay Updated</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.4' }}>
            Subscribe to our newsletter for the latest property listings and updates.
          </p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              required 
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} 
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-text">
          &copy; {currentYear} RentNest Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
