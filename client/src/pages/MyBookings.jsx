import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdCalendarToday, MdMoney, MdCheckCircle, MdPending, MdCancel, MdDelete } from 'react-icons/md';
import bookingService from '../services/bookingService';
import propertyService from '../services/propertyService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/helpers';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState({});
  const [cancelingId, setCancelingId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getMyBookings();
        setBookings(res.data.data || []);

        // Fetch property details for each booking
        if (res.data.data && res.data.data.length > 0) {
          const propMap = {};
          for (const booking of res.data.data) {
            if (booking.property && !propMap[booking.property._id]) {
              try {
                const propRes = await propertyService.getById(booking.property._id);
                propMap[booking.property._id] = propRes.data.data;
              } catch (err) {
                console.error('Failed to fetch property:', err);
              }
            }
          }
          setProperties(propMap);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setCancelingId(bookingId);
    try {
      await bookingService.cancel(bookingId);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-confirmed',
      active: 'status-active',
      completed: 'status-completed',
      rejected: 'status-rejected',
      cancelled: 'status-cancelled',
    };

    const statusIcons = {
      pending: MdPending,
      approved: MdCheckCircle,
      active: MdCheckCircle,
      completed: MdCheckCircle,
      rejected: MdCancel,
      cancelled: MdCancel,
    };

    const badgeClass = statusClasses[status] || 'status-pending';
    const Icon = statusIcons[status] || MdPending;

    return (
      <span className={`booking-status-badge ${badgeClass}`}>
        <Icon size={14} /> {status}
      </span>
    );
  };

  if (loading) return <Loader />;

  // Dynamic tabs filter
  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return booking.status === 'pending';
    if (activeTab === 'active') return ['approved', 'active'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'completed';
    return true;
  });

  return (
    <div className="page animate-fade-in" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-heading-1">My Bookings</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Track details, statuses, and history of your rental bookings.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="booking-tabs">
          {['all', 'pending', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`booking-tab ${activeTab === tab ? 'active' : ''}`}
              style={{ border: 'none', background: 'transparent' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div style={{
            background: 'var(--glass-surface)',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }} className="animate-scale-in">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>No Bookings Found</h2>
            <p style={{
              margin: '0 0 1.5rem 0',
              color: 'var(--color-text-muted)',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.95rem'
            }}>
              No records match this filter. Search for new properties and start booking!
            </p>
            <Link to="/properties" className="btn btn-primary">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="stagger-children" style={{ display: 'grid', gap: '1.25rem' }}>
            {filteredBookings.map((booking) => {
              const property = properties[booking.property?._id] || booking.property;
              const startDate = new Date(booking.startDate);
              const endDate = new Date(booking.endDate);
              const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

              if (!property) return null;

              return (
                <div key={booking._id} className="booking-timeline-card">
                  
                  {/* Property Image */}
                  <img
                    src={property.images?.[0]?.url || FALLBACK_IMAGE}
                    alt={property.title}
                    className="booking-timeline-img"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
                  />

                  {/* Booking Details */}
                  <div className="booking-timeline-info">
                    <div className="booking-timeline-title">
                      <Link to={`/properties/${property._id}`}>
                        {property.title}
                      </Link>
                    </div>
                    <div className="booking-timeline-date" style={{ marginBottom: '8px' }}>
                      📍 {property.location?.city}, {property.location?.state}
                    </div>

                    {/* Booking Stats Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '0.75rem',
                    }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdCalendarToday size={12} /> Check-in
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '2px' }}>
                          {startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdCalendarToday size={12} /> Check-out
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '2px' }}>
                          {endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Nights
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '2px' }}>
                          {nights} Night{nights !== 1 ? 's' : ''}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdMoney size={12} /> Rent Total
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--color-accent)', marginTop: '2px' }}>
                          {formatPrice(booking.rentAmount || (property.price?.amount * nights))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status & Cancel */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    {getStatusBadge(booking.status)}

                    {['pending', 'approved', 'active'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelingId === booking._id}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <MdDelete size={14} /> {cancelingId === booking._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
