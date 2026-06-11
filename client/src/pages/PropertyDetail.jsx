import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdBed, MdBathtub, MdVerified, MdStar, MdEmail, MdPhone, MdPerson, MdCalendarToday, MdSecurity, MdRule, MdInfo } from 'react-icons/md';
import propertyService from '../services/propertyService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/helpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80';
const FALLBACK_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
const handleImgError = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; };
const handleAvatarError = (e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_AVATAR; };

function PropertyDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [property, setProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProperty = async () => {
    try {
      const res = await propertyService.getById(id);
      setProperty(res.data.data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) return <Loader />;
  if (!property) return <div className="container"><p>Property not found</p></div>;

  const mainImage = property.images?.[selectedImageIndex]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa';
  const allImages = property.images || [];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating of 1 to 5 stars');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.addReview(property._id, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(0);
      // Refresh property data to show new review and updated rating
      await fetchProperty();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (count, size = 18, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={interactive ? () => setRating(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'inline-flex',
          }}
          className={interactive ? 'hover:scale-110' : ''}
        >
          <MdStar
            size={size}
            color={
              i <= (interactive ? (hoverRating || rating) : count)
                ? '#fbbf24'
                : 'var(--color-surface-3)'
            }
          />
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="property-detail-page animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="container">
        
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            ← Back to Listings
          </Link>
        </div>

        {/* Title Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 className="text-heading-1" style={{ margin: 0, padding: 0, background: 'none', webkitTextFillColor: 'unset', webkitBackgroundClip: 'unset' }}>{property.title}</h1>
            {property.isVerified && (
              <span className="property-card-verified-badge" style={{ position: 'static' }}>
                ✓ Verified
              </span>
            )}
            <span style={{
              background: property.status === 'available' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              color: property.status === 'available' ? 'var(--color-success)' : 'var(--color-primary)',
              border: `1px solid ${property.status === 'available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'}`,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {property.status}
            </span>
          </div>
          <p className="detail-location">
            📍 {property.location?.address}, {property.location?.city}, {property.location?.state} - {property.location?.pincode}
          </p>
        </div>

        {/* Image Gallery Section */}
        <div className="detail-gallery-section">
          <div className="gallery-main">
            <img
              src={mainImage}
              alt={property.title}
              className="main-image"
              onError={handleImgError}
            />
            <div className="image-counter">
              {selectedImageIndex + 1} / {allImages.length || 1}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="gallery-thumbnails">
              {allImages.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={`${property.title} ${index + 1}`}
                    onError={handleImgError}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two Column Details Grid */}
        <div className="detail-info-section">
          
          {/* Left Column: Details */}
          <div>
            
            {/* Features Row */}
            <div className="detail-features">
              <div className="feature-item">
                <MdBed size={22} className="feature-icon" />
                <div>
                  <div className="feature-label">Bedrooms</div>
                  <div className="feature-value">{property.features?.bedrooms || 0} BHK</div>
                </div>
              </div>
              <div className="feature-item">
                <MdBathtub size={22} className="feature-icon" />
                <div>
                  <div className="feature-label">Bathrooms</div>
                  <div className="feature-value">{property.features?.bathrooms || 0} Bath</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📐</span>
                <div>
                  <div className="feature-label">Area</div>
                  <div className="feature-value">{property.features?.area || 0} sqft</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <div>
                  <div className="feature-label">Type</div>
                  <div className="feature-value" style={{ textTransform: 'capitalize' }}>{property.propertyType}</div>
                </div>
              </div>
            </div>

            {/* AI Insights Card */}
            {property.aiDescription && (
              <div className="ai-insights-card">
                <div className="ai-insights-card-icon">🤖</div>
                <h3>✨ AI Smart Insights</h3>
                <p>"{property.aiDescription}"</p>
              </div>
            )}

            {/* About Property */}
            <div className="detail-about">
              <h2>About This Property</h2>
              <p className="detail-description">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="detail-amenities" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                <h3>Amenities & Comforts</h3>
                <div className="amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span>✨</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Details & Stay Policies */}
            <div className="detail-more" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdCalendarToday color="var(--color-primary)" /> Booking & Stay Policies
              </h3>
              
              <div className="stay-policy-grid">
                <div className="stay-policy-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Min / Max Stay</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '4px' }}>
                    {property.bookingDetails?.minStay || 1} day(s) / {property.bookingDetails?.maxStay || 365} day(s)
                  </div>
                </div>

                <div className="stay-policy-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Check-In / Out</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '4px', lineHeight: '1.4' }}>
                    📥 In: {property.bookingDetails?.checkIn || '2:00 PM'} <br />
                    📤 Out: {property.bookingDetails?.checkOut || '11:00 AM'}
                  </div>
                </div>

                <div className="stay-policy-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Security Deposit</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', marginTop: '4px', color: 'var(--color-accent)' }}>
                    {property.bookingDetails?.securityDeposit ? `₹${property.bookingDetails.securityDeposit.toLocaleString()}` : 'No Deposit'}
                  </div>
                </div>

                <div className="stay-policy-card">
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Extra Charges</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', marginTop: '4px' }}>
                    {property.bookingDetails?.extraCharges || 'None'}
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              {property.bookingDetails?.cancellationPolicy && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.15)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ color: 'var(--color-danger)', fontSize: '1.25rem' }}>🛡️</div>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>Cancellation Policy:</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                      {property.bookingDetails.cancellationPolicy}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* House Rules */}
            {property.bookingDetails?.houseRules?.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdRule color="var(--color-primary)" /> House Rules
                </h3>
                <ul className="house-rules-list">
                  {property.bookingDetails.houseRules.map((rule, index) => (
                    <li key={index} className="house-rule-item">
                      <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>•</span> {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '700' }}>Reviews ({property.totalReviews || 0})</span>
                {property.averageRating > 0 && (
                  <span className="rating-badge">
                    ⭐ {property.averageRating.toFixed(1)} / 5
                  </span>
                )}
              </h3>

              {/* Add Review Form */}
              {isAuthenticated ? (
                user?.role === 'tenant' ? (
                  <form onSubmit={handleReviewSubmit} style={{
                    background: 'var(--glass-surface)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: '2rem'
                  }}>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700' }}>Write a Review</h4>
                    
                    {/* Star Rating Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Your Rating:</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {renderStars(0, 24, true)}
                      </div>
                    </div>

                    {/* Comment text */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <textarea
                        rows="4"
                        placeholder="Share your experience staying in this property..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem' }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn btn-primary btn-sm"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <div style={{
                    padding: '1rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <MdInfo size={20} color="var(--color-primary)" />
                    <span>Only registered tenants can post reviews for properties.</span>
                  </div>
                )
              ) : (
                <div style={{
                  padding: '1rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '2rem'
                }}>
                  🔑 Please <Link to="/login" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>Login</Link> to leave a review.
                </div>
              )}

              {/* Reviews List */}
              {property.reviews && property.reviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {property.reviews.map((rev) => (
                    <div key={rev._id} style={{
                      background: 'var(--glass-surface)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem'
                    }} className="animate-scale-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={rev.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rev.user?.name || 'user')}`}
                            alt={rev.user?.name || 'User'}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-surface-2)' }}
                            onError={handleAvatarError}
                          />
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{rev.user?.name || 'Anonymous User'}</div>
                            <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                              {renderStars(rev.rating, 14)}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No reviews have been posted for this property yet.</p>
              )}
            </div>

          </div>

          {/* Right Column: Pricing & Contact Sidebar */}
          <div>
            
            {/* Price Box */}
            <div className="detail-price-box">
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '0.05em' }}>Rent Amount</div>
              <div className="price-amount">
                ₹{property.price?.amount?.toLocaleString()}
              </div>
              <div className="price-period" style={{ marginBottom: '1.5rem' }}>
                per {property.price?.period || 'month'}
              </div>

              {/* Star Rating summary */}
              {property.averageRating > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '700'
                }}>
                  ⭐ {property.averageRating.toFixed(1)} ({property.totalReviews} reviews)
                </div>
              )}

              {/* Book CTA */}
              <Link
                to={`/properties/${id}/book`}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1rem', display: 'block', textAlign: 'center' }}
              >
                Book This Property
              </Link>

              {/* Divider */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '1.5rem 0' }}></div>

              {/* Owner / Landlord Card */}
              {property.owner && (
                <div>
                  <h4 style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    textAlign: 'left',
                    letterSpacing: '0.05em'
                  }}>
                    Listing Landlord
                  </h4>
                  <div className="landlord-card">
                    <img
                      src={property.owner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(property.owner.name)}`}
                      alt={property.owner.name}
                      className="landlord-avatar"
                      onError={handleAvatarError}
                    />
                    <div className="landlord-info">
                      <div style={{ fontWeight: '700', color: 'var(--color-text)', fontSize: '0.9rem' }}>{property.owner.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                        {property.owner.role === 'admin' ? 'Administrator' : 'Property Owner'}
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {property.owner.email && (
                      <div style={{
                        background: 'var(--color-primary-alpha-10)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left',
                        border: '1px solid rgba(99,102,241,0.15)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px', fontWeight: 'bold' }}>
                          📧 Email Address
                        </div>
                        <a
                          href={`mailto:${property.owner.email}`}
                          style={{
                            color: 'var(--color-primary)',
                            fontWeight: '700',
                            wordBreak: 'break-all',
                            fontSize: '0.9rem'
                          }}
                        >
                          {property.owner.email}
                        </a>
                      </div>
                    )}
                    {property.owner.email && (
                      <a
                        href={`mailto:${property.owner.email}`}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <MdEmail /> Send Email
                      </a>
                    )}
                    {property.owner.phone && (
                      <a
                        href={`tel:${property.owner.phone}`}
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <MdPhone /> Call Landlord
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PropertyDetail;
