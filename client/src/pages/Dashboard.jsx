import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiUpload, FiCheck, FiAlertCircle, FiClock, FiFileText } from 'react-icons/fi';
import { MdBed, MdBathtub, MdLocalParking, MdAttachMoney, MdImage } from 'react-icons/md';
import propertyService from '../services/propertyService';
import uploadService from '../services/uploadService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/helpers';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [docName, setDocName] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [verificationDocs, setVerificationDocs] = useState({});

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await propertyService.getMyProperties();
        setProperties(res.data.data || []);

        // Fetch verification docs for each property
        if (res.data.data && res.data.data.length > 0) {
          const docMap = {};
          for (const prop of res.data.data) {
            try {
              const docRes = await uploadService.getPropertyVerifications(prop._id);
              docMap[prop._id] = docRes.data.data || [];
            } catch (err) {
              console.error('Failed to fetch verifications:', err);
            }
          }
          setVerificationDocs(docMap);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;

    setDeletingId(propertyId);
    try {
      await propertyService.deleteProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      toast.success('Property deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!selectedProperty || !docName || !docFile) {
      return toast.error('Please fill in all fields');
    }

    setUploadingDoc(selectedProperty);
    try {
      const formData = new FormData();
      formData.append('image', docFile);
      formData.append('documentName', docName);

      const res = await uploadService.uploadPropertyVerification(selectedProperty, formData);
      
      // Update verification docs
      setVerificationDocs((prev) => ({
        ...prev,
        [selectedProperty]: [...(prev[selectedProperty] || []), res.data.data],
      }));

      setDocName('');
      setDocFile(null);
      toast.success('Document uploaded successfully! Awaiting AI verification...');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(null);
    }
  };

  const getVerificationBadge = (status) => {
    const styles = {
      verified: { className: 'status-confirmed', icon: FiCheck, text: 'Verified' },
      pending: { className: 'status-pending', icon: FiClock, text: 'Pending' },
      rejected: { className: 'status-cancelled', icon: FiAlertCircle, text: 'Rejected' },
    };

    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
      <span className={`booking-status-badge ${style.className}`}>
        <Icon size={14} /> {style.text}
      </span>
    );
  };

  if (loading) return <Loader />;

  // Stats Calculations
  const totalListings = properties.length;
  const verifiedListings = properties.filter((p) => p.isVerified).length;
  const pendingListings = totalListings - verifiedListings;
  const totalValue = properties.reduce((acc, p) => acc + (p.price?.amount || 0), 0);

  return (
    <div className="page animate-fade-in" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-heading-1">Landlord Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Manage your premium property listings and verification records.
            </p>
          </div>
          <Link to="/create-property" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiPlus size={18} /> Add New Property
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid stagger-children">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">🏡</div>
            <div className="dashboard-stat-content">
              <span className="dashboard-stat-value">{totalListings}</span>
              <span className="dashboard-stat-label">Total Listings</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ color: 'var(--color-success)' }}>✓</div>
            <div className="dashboard-stat-content">
              <span className="dashboard-stat-value">{verifiedListings}</span>
              <span className="dashboard-stat-label">Verified</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ color: 'var(--color-warning)' }}>⏳</div>
            <div className="dashboard-stat-content">
              <span className="dashboard-stat-value">{pendingListings}</span>
              <span className="dashboard-stat-label">Pending AI</span>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon" style={{ color: 'var(--color-accent)' }}>₹</div>
            <div className="dashboard-stat-content">
              <span className="dashboard-stat-value">{formatPrice(totalValue)}</span>
              <span className="dashboard-stat-label">Total Monthly Rent</span>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          /* No Properties */
          <div style={{
            background: 'var(--glass-surface)',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }} className="animate-scale-in">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏡</div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>No Listings Yet</h2>
            <p style={{ margin: '0 0 1.5rem 0', color: 'var(--color-text-muted)' }}>
              Start earning rent by listing your first apartment or villa.
            </p>
            <Link to="/create-property" className="btn btn-primary">
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2.5rem', marginTop: '1rem' }}>
            
            {/* Listings Section */}
            <div>
              <h2 style={{ marginBottom: '1.25rem', fontSize: '1.25rem', fontWeight: '700' }}>Your Registered Listings</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }} className="stagger-children">
                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="property-card"
                  >
                    {/* Property Image */}
                    <div className="property-card-image" style={{ aspectRatio: '16/10' }}>
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0].url}
                          alt={property.title}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--color-surface-2)',
                          color: 'var(--color-text-muted)',
                        }}>
                          <MdImage size={48} />
                        </div>
                      )}
                      
                      {property.isVerified && (
                        <div className="property-card-verified-badge">
                          ✓ Verified
                        </div>
                      )}

                      {property.images && property.images.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(3,7,18,0.75)',
                          backdropFilter: 'blur(4px)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          +{property.images.length - 1} More
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="property-card-body">
                      <div className="property-card-location-row" style={{ marginBottom: '0.25rem' }}>
                        <span className="property-card-location">
                          📍 {property.location?.city}, {property.location?.state}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '750', textTransform: 'uppercase' }}>
                          {property.status}
                        </span>
                      </div>
                      <div className="property-card-title">
                        <Link to={`/properties/${property._id}`}>
                          {property.title}
                        </Link>
                      </div>

                      {/* Features */}
                      <div className="property-card-features">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdBed size={16} /> {property.features?.bedrooms || 0} Bed
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MdBathtub size={16} /> {property.features?.bathrooms || 0} Bath
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📐 {property.features?.area || 0} sqft
                        </span>
                      </div>

                      {/* Verification Docs Count */}
                      {verificationDocs[property._id] && verificationDocs[property._id].length > 0 && (
                        <div style={{
                          background: 'var(--color-primary-alpha-10)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-xs)',
                          marginBottom: '1rem',
                          fontSize: '0.8rem',
                          color: 'var(--color-primary)',
                          fontWeight: '600',
                          border: '1px solid rgba(99,102,241,0.15)'
                        }}>
                          📄 {verificationDocs[property._id].length} document(s) uploaded
                        </div>
                      )}

                      <div className="property-price" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                        {formatPrice(property.price?.amount)}
                        <small>/{property.price?.period || 'mo'}</small>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                      }}>
                        <Link
                          to={`/properties/${property._id}`}
                          className="btn btn-outline btn-sm"
                          style={{ flex: 1 }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedProperty(property._id);
                            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          <FiUpload size={14} /> Docs
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          disabled={deletingId === property._id}
                          className="btn btn-danger btn-sm"
                          style={{ flex: 1 }}
                        >
                          {deletingId === property._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Documents Section */}
            <div className="glass-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }} id="docs-upload-panel">
              <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.35rem', fontWeight: '800' }}>📄 Listing Verification Center</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Upload official deed, taxes, or identity forms for AI evaluation to trigger the "Verified" badge.
              </p>

              {selectedProperty ? (
                <>
                  <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                      Selected Property: <strong>{properties.find(p => p._id === selectedProperty)?.title}</strong>
                    </p>
                  </div>

                  {/* Upload Form */}
                  <form onSubmit={handleUploadDocument} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(3,7,18,0.4)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    alignItems: 'end'
                  }}>
                    <div className="form-group">
                      <label>Document Name (e.g. Property Deed)</label>
                      <input
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="Document label"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Upload File Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                        required
                        style={{ padding: '0.5rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="submit"
                        disabled={uploadingDoc === selectedProperty}
                        className="btn btn-primary"
                        style={{ flex: 2 }}
                      >
                        <FiUpload size={16} />
                        {uploadingDoc === selectedProperty ? 'Uploading...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProperty(null);
                          setDocName('');
                          setDocFile(null);
                        }}
                        className="btn btn-outline"
                        style={{ flex: 1 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  {/* Verification Documents List */}
                  {verificationDocs[selectedProperty] && verificationDocs[selectedProperty].length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: '700' }}>Uploaded Records</h3>
                      {verificationDocs[selectedProperty].map((doc, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'rgba(3,7,18,0.3)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            alignItems: 'center',
                          }}
                          className="animate-scale-in"
                        >
                          <img
                            src={doc.documentImage.url}
                            alt={doc.documentName}
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: 'var(--radius-xs)',
                              objectFit: 'cover',
                              border: '1px solid rgba(255,255,255,0.08)',
                            }}
                          />
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '0.95rem' }}>
                              {doc.documentName}
                            </p>
                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                              Submitted {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                            {doc.aiVerificationResult?.summary && (
                              <p style={{ margin: '6px 0 0 0', color: 'var(--color-accent)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                AI Summary: "{doc.aiVerificationResult.summary}"
                              </p>
                            )}
                          </div>
                          <div>
                            {getVerificationBadge(doc.verificationStatus)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem' }}>
                      No verification documents submitted for this property.
                    </p>
                  )}
                </>
              ) : (
                <div style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  background: 'rgba(3,7,18,0.3)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-muted)',
                  border: '1px dashed rgba(255,255,255,0.08)'
                }}>
                  <p style={{ margin: 0 }}>Select a listing above and click "Docs" to view or submit official records.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
