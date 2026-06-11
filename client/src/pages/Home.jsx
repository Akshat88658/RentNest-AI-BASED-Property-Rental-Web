import { Link } from 'react-router-dom';
import { useProperties } from '../hooks/useProperties';
import PropertyCard from '../components/properties/PropertyCard';
import Loader from '../components/common/Loader';
import { FiCheckCircle, FiShield, FiHeart } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

function Home() {
  const { properties, loading } = useProperties();
  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit animate-slide-up">
            ✨ Next Generation AI-Powered Rental Platform
          </div>
          <h1 className="text-heading-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Find Your Perfect <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-500">
              Rental Home
            </span>
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover handpicked, verified properties and enjoy a seamless booking experience powered by intelligent recommendation engines.
          </p>
          <div className="hero-buttons animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/properties" className="btn btn-primary btn-lg">
              Browse Listings
            </Link>
            <Link to="/ai-chat" className="btn btn-outline btn-lg">
              Ask AI Assistant
            </Link>
          </div>
          
          <div className="hero-stats-row animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="stat-item">
              <span className="stat-number">12K+</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8K+</span>
              <span className="stat-label">Happy Tenants</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99.8%</span>
              <span className="stat-label">Verify Rate</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <div className="hero-image-glow"></div>
          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop&q=80"
              alt="Premium modern villa"
            />
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="text-heading-2">Featured Properties</h2>
            <p className="section-subtitle">
              Handpicked selections from our most premium listings
            </p>
            <div className="section-divider-line"></div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="properties-grid stagger-children">
              {featuredProperties.length > 0 ? (
                featuredProperties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))
              ) : (
                <div className="no-properties">
                  <p>No premium properties available at the moment</p>
                </div>
              )}
            </div>
          )}

          <div className="section-footer animate-slide-up">
            <Link to="/properties" className="btn btn-outline btn-lg">
              Explore All Listings
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="why-choose-us" style={{ background: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="text-heading-2">How RentNest Works</h2>
            <p className="section-subtitle">A seamless 3-step timeline to secure your dream space</p>
            <div className="section-divider-line"></div>
          </div>
          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-step">1</div>
              <h3 className="font-bold text-lg mb-2 mt-4 text-indigo-400">Smart Search</h3>
              <p className="text-sm text-gray-400">Describe your dream home in simple words, and our AI search does the rest.</p>
            </div>
            <div className="timeline-card">
              <div className="timeline-step">2</div>
              <h3 className="font-bold text-lg mb-2 mt-4 text-indigo-400">Instant Verification</h3>
              <p className="text-sm text-gray-400">View rich galleries, check authentic ratings, and view pre-verified host status.</p>
            </div>
            <div className="timeline-card">
              <div className="timeline-step">3</div>
              <h3 className="font-bold text-lg mb-2 mt-4 text-indigo-400">Secure Checkout</h3>
              <p className="text-sm text-gray-400">Pay securely online, sign agreement digitally, and collect keys hassle-free.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="text-heading-2">Why RentNest?</h2>
            <p className="section-subtitle">Experience rental simplified, secured, and automated</p>
            <div className="section-divider-line"></div>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <MdAutoAwesome />
              </div>
              <h3>AI-Powered Search</h3>
              <p>Tailored natural language searches to match exactly what you want.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-wrapper" style={{ color: 'var(--color-success)' }}>
                <FiCheckCircle />
              </div>
              <h3>100% Verified Listings</h3>
              <p>Strict property and host verification processes to eliminate fraud.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-wrapper" style={{ color: 'var(--color-accent)' }}>
                <FiShield />
              </div>
              <h3>Secure Escrow Payments</h3>
              <p>Deposits are kept securely in escrow until move-in validation.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon-wrapper" style={{ color: 'var(--color-danger)' }}>
                <FiHeart />
              </div>
              <h3>Premium Tenant Support</h3>
              <p>Round the clock support matching any request or dispute mediation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
