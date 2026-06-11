import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../constants';
import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const visibleLinks = NAV_LINKS.filter((link) => {
    // Check if protected
    if (link.protected && !isAuthenticated) return false;
    
    // Check if role-specific
    if (link.roles && !link.roles.includes(user?.role)) return false;
    
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          🏠 RentNest
        </Link>

        <ul className="navbar-links">
          {visibleLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <span className="navbar-user">Hi, {user?.name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {mobileMenuOpen && (
          <div className="navbar-mobile-menu active">
            {visibleLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="navbar-mobile-actions">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-outline btn-sm w-full">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline btn-sm w-full" onClick={closeMobileMenu}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm w-full" onClick={closeMobileMenu}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
