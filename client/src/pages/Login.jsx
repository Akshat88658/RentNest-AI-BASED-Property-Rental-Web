import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-page-container animate-fade-in">
      {/* Left Panel - Hero Grid */}
      <div className="auth-left-panel">
        <div className="auth-glow-orb-1"></div>
        <div className="auth-glow-orb-2"></div>
        
        <div className="auth-left-content">
          <h2>Welcome Back to RentNest</h2>
          <p>
            Sign in to continue exploring premium rental properties, managing your bookings, and chatting with our smart AI assistant.
          </p>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: '1rem',
              opacity: 0.8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Why Choose RentNest?
            </h3>
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {[
                'Find your dream space with AI recommendations',
                'Secure escrow contracts & validated landlords',
                '24/7 priority tenant mediation support'
              ].map((item) => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  color: '#e2e8f0'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    boxShadow: 'var(--shadow-glow-cyan)'
                  }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>Sign In</h3>
            <p>Access your RentNest dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email-input">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail size={18} style={{ color: 'var(--color-text-muted)', position: 'absolute', left: '14px' }} />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password-input">Password</label>
              <div className="password-input-wrapper">
                <FiLock size={18} style={{ color: 'var(--color-text-muted)', position: 'absolute', left: '14px' }} />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              {isLoading ? (
                <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>


          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: 'var(--color-primary)',
              fontWeight: '600',
            }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
