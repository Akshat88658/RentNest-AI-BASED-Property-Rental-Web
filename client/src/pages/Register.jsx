import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';
import { FiUser, FiMail, FiLock, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tenant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('Please fill in all required fields');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = {
    length: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <section className="auth-page-container animate-fade-in">
      {/* Left Panel - Hero Grid */}
      <div className="auth-left-panel">
        <div className="auth-glow-orb-1"></div>
        <div className="auth-glow-orb-2"></div>
        
        <div className="auth-left-content">
          <h2>Start Your Journey with RentNest</h2>
          <p>
            Join thousands of tenants and landlords finding perfect property matches and enjoying modern escrow agreements.
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
              Get Started in Minutes
            </h3>
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {[
                'Create your tenant or landlord profile',
                'Browse properties or list your home with smart AI taggers',
                'Connect directly via real-time chats',
                'Transact with complete protection & verified agreements',
              ].map((item) => (
                <li key={item} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  color: '#e2e8f0',
                }}>
                  <FiCheck size={18} style={{ color: 'var(--color-success)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-right-panel" style={{ overflowY: 'auto' }}>
        <div className="auth-card">
          <div className="auth-card-header">
            <h3>Create Account</h3>
            <p>Join RentNest today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Role Selection */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'tenant' })}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  border: formData.role === 'tenant' ? `2px solid var(--color-primary)` : `1px solid var(--color-border)`,
                  background: formData.role === 'tenant' ? 'var(--color-primary-alpha-10)' : 'var(--color-surface)',
                  color: formData.role === 'tenant' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                👤 Tenant
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'landlord' })}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  border: formData.role === 'landlord' ? `2px solid var(--color-primary)` : `1px solid var(--color-border)`,
                  background: formData.role === 'landlord' ? 'var(--color-primary-alpha-10)' : 'var(--color-surface)',
                  color: formData.role === 'landlord' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                🏠 Landlord
              </button>
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name-input">Full Name</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiUser size={18} style={{ color: 'var(--color-text-muted)', position: 'absolute', left: '14px' }} />
                <input
                  id="name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.75rem', width: '100%' }}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email-input">Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail size={18} style={{ color: 'var(--color-text-muted)', position: 'absolute', left: '14px' }} />
                <input
                  id="email-input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

              {/* Password Strength */}
              {formData.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '6px',
                  }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: '4px',
                        background: i <= strengthScore ? (
                          strengthScore === 1 ? 'var(--color-warning)' :
                          strengthScore === 2 ? 'var(--color-accent)' :
                          'var(--color-success)'
                        ) : 'var(--color-border)',
                        borderRadius: '2px',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {strengthScore === 1 && '8+ characters recommended'}
                    {strengthScore === 2 && 'Add a number or symbol'}
                    {strengthScore === 3 && 'Strong password!'}
                  </p>
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              {isLoading ? (
                <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>


          <p style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{
              color: 'var(--color-primary)',
              fontWeight: '600',
            }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
