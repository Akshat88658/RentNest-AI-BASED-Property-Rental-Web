import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { MdCreditCard, MdPhone, MdAccountBalance } from 'react-icons/md';
import propertyService from '../services/propertyService';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import { formatPrice } from '../utils/helpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80';
const handleImgError = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; };

function BookProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: 'credit-card',
    message: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await propertyService.getById(id);
        setProperty(res.data.data);
      } catch (error) {
        toast.error('Failed to load property');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateStay = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    return Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  const totalDays = calculateStay();
  const totalPrice = totalDays * (property?.price?.amount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingData.startDate || !bookingData.endDate) {
      return toast.error('Please select check-in and check-out dates');
    }

    if (new Date(bookingData.startDate) >= new Date(bookingData.endDate)) {
      return toast.error('Check-out date must be after check-in date');
    }

    setIsSubmitting(true);
    try {
      await bookingService.create({
        property: id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message,
      });

      toast.success('Booking request submitted! Owner will review shortly.');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) return <div className="container"><p>Property not found</p></div>;

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: MdCreditCard },
    { id: 'debit-card', name: 'Debit Card', icon: MdCreditCard },
    { id: 'upi', name: 'UPI / GPay', icon: MdPhone },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: MdAccountBalance },
  ];

  // Dynamic Step Calculations for Wizard
  const isStep1Done = !!(bookingData.startDate && bookingData.endDate);
  const isStep2Done = isStep1Done && !!bookingData.paymentMethod;

  return (
    <div className="page animate-fade-in" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container">
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={`/properties/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <FiArrowLeft /> Back to Details
          </Link>
        </div>

        {/* 3-Step Checkout Wizard Node */}
        <div className="checkout-steps">
          <div className={`checkout-step-node ${isStep1Done ? 'completed' : 'active'}`}>
            <div className="checkout-step-number">
              {isStep1Done ? <FiCheck size={16} /> : '1'}
            </div>
            <span className="checkout-step-label">Select Dates</span>
          </div>
          <div className={`checkout-step-node ${isStep2Done ? 'completed' : isStep1Done ? 'active' : ''}`}>
            <div className="checkout-step-number">
              {isStep2Done ? <FiCheck size={16} /> : '2'}
            </div>
            <span className="checkout-step-label">Payment Mode</span>
          </div>
          <div className={`checkout-step-node ${isStep2Done ? 'active' : ''}`}>
            <div className="checkout-step-number">3</div>
            <span className="checkout-step-label">Confirm</span>
          </div>
        </div>

        <div className="checkout-grid">
          
          {/* Left: Booking Form */}
          <div className="glass-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800' }}>Book {property.title}</h2>

            <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1.5rem' }}>
              
              {/* Dates Section */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="startDate">Check-in Date</label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Check-out Date</label>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group">
                <label>Select Payment Method</label>
                <div className="payment-methods-grid">
                  {paymentMethods.map(({ id: methodId, name, icon: Icon }) => (
                    <div
                      key={methodId}
                      className={`payment-card-option ${bookingData.paymentMethod === methodId ? 'selected' : ''}`}
                      onClick={() => setBookingData((prev) => ({ ...prev, paymentMethod: methodId }))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={18} style={{ color: bookingData.paymentMethod === methodId ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message">Message to Landlord (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={bookingData.message}
                  onChange={handleInputChange}
                  placeholder="Share a brief intro about yourself or query..."
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {isSubmitting ? (
                  <div className="loader-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></div>
                ) : (
                  'Request Booking'
                )}
              </button>
            </form>
          </div>

          {/* Right: Summary */}
          <div>
            <div className="price-summary-widget">
              {/* Image */}
              <img
                src={property.images?.[0]?.url || FALLBACK_IMAGE}
                alt={property.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}
                onError={handleImgError}
              />

              <h3 style={{ margin: '0 0 1rem 0' }}>Booking Summary</h3>
              
              <div className="price-summary-row">
                <span>Property Name:</span>
                <strong style={{ color: 'var(--color-text)' }}>{property.title}</strong>
              </div>
              <div className="price-summary-row">
                <span>Rent Period:</span>
                <span>Per {property.price?.period || 'month'}</span>
              </div>
              <div className="price-summary-row">
                <span>Rate:</span>
                <strong>{formatPrice(property.price?.amount || 0)}</strong>
              </div>
              
              {totalDays > 0 && (
                <>
                  <div className="price-summary-row">
                    <span>Stay Duration:</span>
                    <strong>{totalDays} days</strong>
                  </div>
                  <div className="price-summary-row total">
                    <span>Total Rent:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </>
              )}

              <div style={{
                background: 'var(--color-primary-alpha-10)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                margin: '1.25rem 0',
                border: '1px solid rgba(99,102,241,0.15)'
              }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  ℹ️ Once submitted, the landlord will review your request and confirm stay details within 24 hours.
                </p>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <FiCheck size={16} style={{ color: 'var(--color-success)' }} /> {property.features?.bedrooms || 0} Bedrooms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <FiCheck size={16} style={{ color: 'var(--color-success)' }} /> {property.features?.bathrooms || 0} Bathrooms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <FiCheck size={16} style={{ color: 'var(--color-success)' }} /> {property.features?.area || 0} sq ft
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookProperty;
