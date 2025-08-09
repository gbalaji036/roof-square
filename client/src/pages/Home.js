import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const response = await propertyAPI.getAll({ featured: true });
      setFeaturedProperties(response.data.slice(0, 6)); // Show only 6 featured
      setLoading(false);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
            Welcome to ROOF SQUARE REALTY
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Your trusted partner in finding the perfect property
          </p>
          <Link to="/properties" className="btn" style={{ fontSize: '1.1rem', padding: '15px 30px' }}>
            View All Properties
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Browse by Category</h2>
          <div className="grid">
            <Link to="/properties/Upcoming Project" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>Upcoming Projects</h3>
              <p>Discover new developments coming soon</p>
            </Link>
            <Link to="/properties/New Launch" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>New Launch</h3>
              <p>Fresh properties just launched in the market</p>
            </Link>
            <Link to="/properties/Luxury Homes" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>Luxury Homes</h3>
              <p>Premium properties for discerning buyers</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section style={{ padding: '60px 0', background: '#f8f9fa' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Featured Properties</h2>
            <div className="grid">
              {featuredProperties.map((property) => (
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
                      {property.description.substring(0, 100)}...
                    </p>
                    <p><strong>City:</strong> {property.city}</p>
                    <p className="property-price">{property.price}</p>
                    <Link to={`/property/${property._id}`} className="btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Contact us today for personalized assistance</p>
            <div style={{ marginTop: '20px' }}>
              <span style={{ marginRight: '20px' }}>📞 +91 9876543210</span>
              <span>📧 info@roofsquarerealty.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
