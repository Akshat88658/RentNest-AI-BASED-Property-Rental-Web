import { Link } from 'react-router-dom';
import { formatPrice, truncate } from '../../utils/helpers';
import { MdBed, MdBathtub } from 'react-icons/md';
import { FiHeart } from 'react-icons/fi';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80';

function PropertyCard({ property }) {
  const { _id, title, images, price, location, features, averageRating, propertyType, isVerified } = property;

  return (
    <div className="property-card">
      <div className="property-card-image">
        <img
          src={images?.[0]?.url || FALLBACK_IMAGE}
          alt={title}
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }}
        />
        <div className="property-type-badge">
          {propertyType}
        </div>
        
        {isVerified && (
          <div className="property-card-verified-badge">
            ✓ Verified
          </div>
        )}

        <button 
          className="property-card-save-btn" 
          onClick={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
          }}
          aria-label="Save property"
        >
          <FiHeart size={16} />
        </button>

        {averageRating > 0 && (
          <div className="property-card-rating-badge">
            ⭐ {averageRating.toFixed(1)}
          </div>
        )}

        <div className="property-card-overlay">
          <span className="btn btn-primary btn-sm animate-scale-in">
            View Details
          </span>
        </div>
      </div>

      <div className="property-card-body">
        <div>
          <div className="property-card-location-row">
            <span className="property-card-location">
              📍 {location?.city}, {location?.state}
            </span>
            {features?.furnished && (
              <span className="property-card-furnished-badge">
                {features.furnished.replace('-furnished', '')}
              </span>
            )}
          </div>
          <div className="property-card-title">
            <Link to={`/properties/${_id}`}>
              {title}
            </Link>
          </div>
        </div>

        <div className="property-card-features">
          <span>
            <MdBed size={16} /> {features?.bedrooms || 0} Bed
          </span>
          <span>
            <MdBathtub size={16} /> {features?.bathrooms || 0} Bath
          </span>
          <span>
            📐 {features?.area || 0} sqft
          </span>
        </div>

        <div className="property-card-footer">
          <div>
            <div className="property-price">
              {formatPrice(price?.amount)}
              <small>/{price?.period || 'mo'}</small>
            </div>
          </div>
          <Link
            to={`/properties/${_id}`}
            className="btn btn-primary btn-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
