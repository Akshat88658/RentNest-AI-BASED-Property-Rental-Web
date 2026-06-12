import { useState, useEffect } from 'react';
import propertyService from '../services/propertyService';
import aiService from '../services/aiService';
import PropertyCard from '../components/properties/PropertyCard';
import toast from 'react-hot-toast';
import { FiSearch, FiGrid, FiList, FiSliders } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

function PropertySkeleton() {
  return (
    <div className="property-card shimmer">
      <div style={{ aspectRatio: '16/10', background: 'var(--color-surface-2)' }} className="shimmer" />
      <div className="property-card-body">
        <div style={{ height: '12px', background: 'var(--color-surface-3)', borderRadius: '4px', width: '40%', marginBottom: '12px' }} className="shimmer" />
        <div style={{ height: '22px', background: 'var(--color-surface-3)', borderRadius: '4px', width: '80%', marginBottom: '16px' }} className="shimmer" />
        <div style={{ height: '38px', background: 'var(--color-surface-3)', borderRadius: '4px', marginTop: 'auto' }} className="shimmer" />
      </div>
    </div>
  );
}

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    city: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    furnished: '',
  });
  const [pagination, setPagination] = useState({ current: 1, total: 1 });

  const [aiQuery, setAiQuery] = useState('');
  const [isAISearching, setIsAISearching] = useState(false);

  const fetchProperties = async (page = 1) => {
    setLoading(true);
    try {
      const res = await propertyService.getAll({ ...filters, page });
      setProperties(res.data.data);
      setPagination({ current: res.data.currentPage, total: res.data.totalPages });
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProperties(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [filters]);



  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiQuery) return toast.error('Please type what you are looking for!');

    setIsAISearching(true);
    try {
      const res = await aiService.smartSearch(aiQuery);
      const aiFilters = res.data.data;

      setFilters((prev) => ({
        ...prev,
        search: aiFilters.search || prev.search,
        city: aiFilters.city || '',
        type: aiFilters.type || '',
        bedrooms: aiFilters.bedrooms || '',
        furnished: aiFilters.furnished || '',
        minPrice: aiFilters.minPrice || '',
        maxPrice: aiFilters.maxPrice || '',
      }));

      toast.success('AI successfully interpreted your search!');
    } catch (error) {
      toast.error('Failed to parse search with AI');
    } finally {
      setIsAISearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      city: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      furnished: '',
    });
  };

  return (
    <div className="page animate-fade-in" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="text-heading-1">Explore Listings</h1>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Find your perfect luxury home or smart apartment with RentNest.
            </p>
          </div>
          
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'var(--color-surface-2)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'grid' ? 'white' : 'var(--color-text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <FiGrid size={16} /> Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'list' ? 'white' : 'var(--color-text-muted)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              <FiList size={16} /> List
            </button>
          </div>
        </div>
      </div>

      {/* AI Search Box */}
      <form onSubmit={handleAISearch} className="ai-search-card">
        <label style={{
          display: 'flex',
          color: 'var(--color-accent)',
          fontWeight: '700',
          marginBottom: '0.75rem',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <MdAutoAwesome className="animate-float" /> AI Smart Search
        </label>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <input
            type="text"
            placeholder="e.g., 'luxury villa with pool in Goa under 50000'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
            }}
          />
          <button
            type="submit"
            disabled={isAISearching}
            className="btn btn-primary"
            style={{ minWidth: '120px' }}
          >
            {isAISearching ? (
              <div className="loader-spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', margin: 0 }}></div>
            ) : (
              'Ask AI'
            )}
          </button>
        </div>
      </form>

      {/* Filters Section */}
      <div className="properties-filters-bar">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end',
        }}>
          {/* Search Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Search
            </label>
            <input
              type="text"
              name="search"
              placeholder="Keyword..."
              value={filters.search}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.65rem' }}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.65rem', cursor: 'pointer' }}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Mumbai"
              value={filters.city}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.65rem' }}
            />
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--color-text-muted)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Bedrooms
            </label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '0.65rem', cursor: 'pointer' }}
            >
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={clearFilters}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Properties Count Header */}
      {!loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeIn 0.5s' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
            Showing <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{properties.length}</span> luxury properties matching your search.
          </p>
        </div>
      )}

      {/* Properties Listing */}
      <div className={viewMode === 'grid' ? "properties-grid stagger-children" : "flex flex-col gap-6 stagger-children"}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <PropertySkeleton key={i} />)
          : properties.length > 0
          ? properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          : (
            <div style={{
              gridColumn: '1 / -1',
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'var(--glass-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed rgba(255,255,255,0.1)',
            }} className="animate-scale-in">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                🏢
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--color-text)',
                marginBottom: '0.5rem',
              }}>
                No properties found
              </h3>
              <p style={{
                color: 'var(--color-text-muted)',
                marginBottom: '1.5rem',
              }}>
                Try adjusting your search query or reset your filters to start fresh.
              </p>
              <button onClick={clearFilters} className="btn btn-primary">
                Reset All Filters
              </button>
            </div>
          )}
      </div>

      {/* Pagination */}
      {!loading && pagination.total > 1 && (
        <div className="pagination-container">
          <button
            disabled={pagination.current === 1}
            onClick={() => fetchProperties(pagination.current - 1)}
            className="btn btn-outline btn-sm"
          >
            Prev
          </button>

          <span className="pagination-info">
            Page {pagination.current} / {pagination.total}
          </span>

          <button
            disabled={pagination.current === pagination.total}
            onClick={() => fetchProperties(pagination.current + 1)}
            className="btn btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Properties;
