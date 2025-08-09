import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getById(id);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <div className="container">Loading property details...</div>;
  }

  if (!property) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Property Not Found</h2>
          <Link to="/properties" className="btn">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/properties" className="btn btn-secondary">← Back to Properties</Link>
      </div>

      <div className="card">
        <h1>{property.title}</h1>
        
        {/* Image Gallery */}
        {property.images.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <img
                src={`http://localhost:5000/uploads/${property.images[currentImageIndex]}`}
                alt={property.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer'
                    }}
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer'
                    }}
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {property.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/uploads/${image}`}
                    alt={`${property.title} ${index + 1}`}
                    style={{
                      width: '80px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: index === currentImageIndex ? '2px solid #007bff' : '2px solid transparent'
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div>
            <h2>Description</h2>
            <p style={{ lineHeight: '1.6' }}>{property.description}</p>
          </div>
          
          <div>
            <h2>Property Details</h2>
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <p><strong>Price:</strong> {property.price}</p>
              <p><strong>City:</strong> {property.city}</p>
              <p><strong>Status:</strong> {property.status}</p>
              <p><strong>Categories:</strong></p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                {property.categories.map((category, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
              {property.featured && (
                <p style={{ 
                  marginTop: '15px', 
                  color: '#28a745', 
                  fontWeight: 'bold' 
                }}>
                  ⭐ Featured Property
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ marginTop: '40px', padding: '30px', background: '#007bff', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <h2>Interested in this property?</h2>
          <p>Contact us for more information or to schedule a visit</p>
          <div style={{ marginTop: '20px' }}>
            <span style={{ marginRight: '30px' }}>📞 +91 9876543210</span>
            <span>📧 info@roofsquarerealty.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
