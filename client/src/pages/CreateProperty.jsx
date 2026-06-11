import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome, MdLocationOn, MdFeaturedPlayList, MdCalendarToday, MdPhotoCamera, MdAutoAwesome } from 'react-icons/md';
import propertyService from '../services/propertyService';
import uploadService from '../services/uploadService';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';

function CreateProperty() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    price: {
      amount: '',
      currency: 'INR',
      period: 'monthly'
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      furnished: 'unfurnished',
      parking: false,
      petFriendly: false
    },
    amenities: [],
    bookingDetails: {
      minStay: 1,
      maxStay: 365,
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellationPolicy: 'Flexible',
      securityDeposit: '',
      extraCharges: '',
      houseRules: []
    },
    images: [],
    aiDescription: ''
  });

  // Local state for dynamic list inputs
  const [ruleInput, setRuleInput] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePriceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [field]: value
      }
    }));
  };

  const handleAddRule = () => {
    if (!ruleInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      bookingDetails: {
        ...prev.bookingDetails,
        houseRules: [...prev.bookingDetails.houseRules, ruleInput.trim()]
      }
    }));
    setRuleInput('');
  };

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      bookingDetails: {
        ...prev.bookingDetails,
        houseRules: prev.bookingDetails.houseRules.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddAmenity = () => {
    if (!amenityInput.trim()) return;
    if (formData.amenities.includes(amenityInput.trim())) {
      toast.error('Amenity already added');
      return;
    }
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, amenityInput.trim()]
    }));
    setAmenityInput('');
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const handleRemoveSelectedImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select images to upload first');
      return;
    }

    setUploadingImages(true);
    const fd = new FormData();
    imageFiles.forEach(file => {
      fd.append('images', file);
    });

    try {
      const res = await uploadService.uploadPropertyImages(fd);
      const uploadedImages = res.data.data.map(img => ({
        url: img.url,
        public_id: img.public_id
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      toast.success('Images uploaded successfully!');
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleGenerateAIDescription = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in title and description first');
      return;
    }

    setGeneratingAI(true);
    try {
      const res = await aiService.generateDescription({
        title: formData.title,
        propertyType: formData.propertyType,
        features: formData.features,
        location: formData.location,
        amenities: formData.amenities
      });

      setFormData(prev => ({
        ...prev,
        aiDescription: res.data.data
      }));
      toast.success('AI description generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate AI description');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) return toast.error('Property title is required');
    if (!formData.description) return toast.error('Description is required');
    if (!formData.price.amount) return toast.error('Rent price is required');
    if (!formData.location.address || !formData.location.city) {
      return toast.error('Full address and city are required');
    }
    if (formData.images.length === 0) {
      return toast.error('Please upload at least 1 image before listing');
    }

    setLoading(true);
    try {
      await propertyService.create(formData);
      toast.success('Property listing created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <MdHome /> },
    { id: 'location', label: 'Location', icon: <MdLocationOn /> },
    { id: 'features', label: 'Features', icon: <MdFeaturedPlayList /> },
    { id: 'policies', label: 'Policies', icon: <MdCalendarToday /> },
    { id: 'media', label: 'Media & AI', icon: <MdPhotoCamera /> }
  ];

  return (
    <div className="page animate-fade-in" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 className="text-heading-1">List Your Property</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
            List your space on RentNest with verified credentials and AI assistance.
          </p>
        </div>

        {/* Tabbed Navigation */}
        <div className="booking-tabs" style={{ overflowX: 'auto', display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {tabs.map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`booking-tab ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                flex: '1',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="glass-surface" style={{ padding: '2rem', borderRadius: 'var(--radius-md)' }}>

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="title">Property Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Cozy 2BHK Near Metro Station"
                  value={formData.title}
                  onChange={(e) => handleInputChange(null, 'title', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="propertyType">Property Type</label>
                  <select
                    id="propertyType"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange(null, 'propertyType', e.target.value)}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="condo">Condo</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="period">Rent Period</label>
                  <select
                    id="period"
                    value={formData.price.period}
                    onChange={(e) => handlePriceChange('period', e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Monthly Rent Price (INR)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="e.g. 25000"
                  value={formData.price.amount}
                  onChange={(e) => handlePriceChange('amount', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Detailed Description</label>
                <textarea
                  id="description"
                  rows="5"
                  placeholder="Describe your property details, nearby metro, security, and policies..."
                  value={formData.description}
                  onChange={(e) => handleInputChange(null, 'description', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('location')}>Next: Location →</button>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION */}
          {activeTab === 'location' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="address">Full Address</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Flat/House No, Society Name, Street Name"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location', 'address', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={formData.location.city}
                    onChange={(e) => handleInputChange('location', 'city', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={formData.location.state}
                    onChange={(e) => handleInputChange('location', 'state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  placeholder="e.g. 400001"
                  value={formData.location.pincode}
                  onChange={(e) => handleInputChange('location', 'pincode', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('basic')}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('features')}>Next: Features →</button>
              </div>
            </div>
          )}

          {/* TAB 3: FEATURES & AMENITIES */}
          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <input
                    id="bedrooms"
                    type="number"
                    value={formData.features.bedrooms}
                    onChange={(e) => handleInputChange('features', 'bedrooms', Number(e.target.value))}
                    min="1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="bathrooms">Bathrooms</label>
                  <input
                    id="bathrooms"
                    type="number"
                    value={formData.features.bathrooms}
                    onChange={(e) => handleInputChange('features', 'bathrooms', Number(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="area">Area (sq ft)</label>
                  <input
                    id="area"
                    type="number"
                    placeholder="e.g. 1000"
                    value={formData.features.area}
                    onChange={(e) => handleInputChange('features', 'area', Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="furnished">Furnishing Status</label>
                <select
                  id="furnished"
                  value={formData.features.furnished}
                  onChange={(e) => handleInputChange('features', 'furnished', e.target.value)}
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="fully-furnished">Fully Furnished</option>
                </select>
              </div>

              {/* Checkbox fields */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={formData.features.parking}
                    onChange={(e) => handleInputChange('features', 'parking', e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Parking Available</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={formData.features.petFriendly}
                    onChange={(e) => handleInputChange('features', 'petFriendly', e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Pet Friendly</span>
                </label>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Property Amenities</label>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. WiFi, AC, Lift, Security, Pool, Gym"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    style={{ flex: '1' }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddAmenity}>Add</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.amenities.map((amenity, index) => (
                    <span key={index} style={{
                      background: 'var(--color-surface-2)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '600',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      {amenity}
                      <button type="button" onClick={() => handleRemoveAmenity(index)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', padding: '0 2px' }}>×</button>
                    </span>
                  ))}
                  {formData.amenities.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No amenities added yet.</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('location')}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('policies')}>Next: Policies →</button>
              </div>
            </div>
          )}

          {/* TAB 4: BOOKING POLICIES */}
          {activeTab === 'policies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="minStay">Min Stay (Days)</label>
                  <input
                    id="minStay"
                    type="number"
                    value={formData.bookingDetails.minStay}
                    onChange={(e) => handleInputChange('bookingDetails', 'minStay', Number(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="maxStay">Max Stay (Days)</label>
                  <input
                    id="maxStay"
                    type="number"
                    value={formData.bookingDetails.maxStay}
                    onChange={(e) => handleInputChange('bookingDetails', 'maxStay', Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="checkIn">Check-in Time</label>
                  <input
                    id="checkIn"
                    type="text"
                    value={formData.bookingDetails.checkIn}
                    onChange={(e) => handleInputChange('bookingDetails', 'checkIn', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="checkOut">Check-out Time</label>
                  <input
                    id="checkOut"
                    type="text"
                    value={formData.bookingDetails.checkOut}
                    onChange={(e) => handleInputChange('bookingDetails', 'checkOut', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="securityDeposit">Security Deposit (INR)</label>
                  <input
                    id="securityDeposit"
                    type="number"
                    placeholder="e.g. 50000"
                    value={formData.bookingDetails.securityDeposit}
                    onChange={(e) => handleInputChange('bookingDetails', 'securityDeposit', Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cancellationPolicy">Cancellation Policy</label>
                  <input
                    id="cancellationPolicy"
                    type="text"
                    placeholder="e.g. Free cancellation up to 7 days before check-in"
                    value={formData.bookingDetails.cancellationPolicy}
                    onChange={(e) => handleInputChange('bookingDetails', 'cancellationPolicy', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="extraCharges">Extra Charges / Notes</label>
                <input
                  id="extraCharges"
                  type="text"
                  placeholder="e.g. Cleaning: ₹1000 per stay, Electricity as per meter"
                  value={formData.bookingDetails.extraCharges}
                  onChange={(e) => handleInputChange('bookingDetails', 'extraCharges', e.target.value)}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>House Rules</label>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. No smoking inside, No loud music after 10 PM"
                    value={ruleInput}
                    onChange={(e) => setRuleInput(e.target.value)}
                    style={{ flex: '1' }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddRule}>Add</button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {formData.bookingDetails.houseRules.map((rule, index) => (
                    <span key={index} style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--color-text)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '600',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                      {rule}
                      <button type="button" onClick={() => handleRemoveRule(index)} style={{ border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', padding: '0 2px' }}>×</button>
                    </span>
                  ))}
                  {formData.bookingDetails.houseRules.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No house rules added yet.</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('features')}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab('media')}>Next: Media & AI →</button>
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & AI DESCRIPTION */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group">
                <label>Upload Property Images</label>
                <div className="document-upload-dropzone" style={{ cursor: 'pointer', position: 'relative' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <div className="upload-icon">📸</div>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--color-text)' }}>Click to select images</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>PNG, JPG, JPEG up to 5MB each</div>
                </div>
              </div>

              {/* Selection Previews */}
              {imagePreviews.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem' }}>Selected Local Previews ({imagePreviews.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(239, 68, 68, 0.95)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={uploadingImages}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {uploadingImages ? 'Uploading to Cloudinary...' : 'Confirm Upload to Cloudinary'}
                  </button>
                </div>
              )}

              {/* Uploaded Cloudinary Images */}
              {formData.images.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--color-success)', marginBottom: '0.75rem' }}>Cloud Verified Images ({formData.images.length})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                    {formData.images.map((img, index) => (
                      <div key={index} style={{ aspectRatio: '1', borderRadius: 'var(--radius-xs)', overflow: 'hidden', border: '2px solid var(--color-success)' }}>
                        <img src={img.url} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Description Generator */}
              <div className="ai-insights-card" style={{ marginTop: '1rem', marginBottom: 0 }}>
                <div className="ai-insights-card-icon">🤖</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '1rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                    <MdAutoAwesome className="animate-float" /> AI Smart Description
                  </h3>
                  <button
                    type="button"
                    onClick={handleGenerateAIDescription}
                    disabled={generatingAI}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {generatingAI ? 'Writing...' : 'Generate with AI'}
                  </button>
                </div>

                <textarea
                  rows="4"
                  placeholder="AI description will be automatically generated based on form features. You can customize it manually."
                  value={formData.aiDescription}
                  onChange={(e) => handleInputChange(null, 'aiDescription', e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('policies')}>← Back</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ minWidth: '150px' }}
                >
                  {loading ? 'Submitting...' : 'List Property'}
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}

export default CreateProperty;
