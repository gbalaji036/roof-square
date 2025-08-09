import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';

const Properties = () => {
  const { category } = useParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    category: category || ''
  });

  useEffect(() => {
    fetchProperties();
  }, [category]);

  const fetchProperties = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      if (filters.city) params.city = filters.city;
      
      const response = await propertyAPI.getAll(params);
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchProperties();
  };

  if (loading) {
    return <div className="container">Loading properties...</div>;
  }

  return (
    <div className="container">
      <h1>{category ? `${category} Properties` : 'All Properties'}</h1>
      
      {/* Filters */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>Filters</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'end' }}>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
          </div>
          <button className="btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              setFilters({ city: '', category: category || '' });
              setTimeout(fetchProperties, 100);
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No properties found</h3>
          <p>Try adjusting your filters or check back later for new listings.</p>
        </div>
      ) : (
        <div className="grid">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              {property.images.length > 0 && (
                <img
                  src={`http://localhost:5000/uploads/${property.images[0]}`}
                  alt={property.title}
                  className="property-image"
                />
              )}
              <div className="property-info">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-description">
                  {property.description.substring(0, 150)}...
                </p>
                <p><strong>City:</strong> {property.city}</p>
                <p><strong>Status:</strong> {property.status}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '10px 0' }}>
                  {property.categories.map((cat, index) => (
                    <span 
                      key={index}
                      style={{
                        background: '#e9ecef',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <p className="property-price">{property.price}</p>
                <Link to={`/property/${property._id}`} className="btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;
