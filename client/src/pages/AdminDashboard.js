import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI, adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  // Property form state
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    city: '',
    price: '',
    categories: [],
    featured: false,
    status: 'Available'
  });
  const [propertyImages, setPropertyImages] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);

  // Logo upload state
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchProperties();
    fetchLogo();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyAPI.getAll();
      setProperties(response.data);
    } catch (error) {
      setMessage('Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogo = async () => {
    try {
      const response = await adminAPI.getLogo();
      setLogo(response.data.logoUrl);
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handlePropertyFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'categories') {
        const updatedCategories = checked
          ? [...propertyForm.categories, value]
          : propertyForm.categories.filter(cat => cat !== value);
        setPropertyForm({ ...propertyForm, categories: updatedCategories });
      } else {
        setPropertyForm({ ...propertyForm, [name]: checked });
      }
    } else {
      setPropertyForm({ ...propertyForm, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setPropertyImages(Array.from(e.target.files));
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(propertyForm).forEach(key => {
        if (key === 'categories') {
          propertyForm.categories.forEach(category => {
            formData.append('categories', category);
          });
        } else {
          formData.append(key, propertyForm[key]);
        }
      });

      propertyImages.forEach(image => {
        formData.append('images', image);
      });

      if (editingProperty) {
        await propertyAPI.update(editingProperty._id, formData);
        setMessage('Property updated successfully!');
        setEditingProperty(null);
      } else {
        await propertyAPI.create(formData);
        setMessage('Property added successfully!');
      }

      // Reset form
      setPropertyForm({
        title: '',
        description: '',
        city: '',
        price: '',
        categories: [],
        featured: false,
        status: 'Available'
      });
      setPropertyImages([]);
      document.getElementById('property-images').value = '';
      
      fetchProperties();
    } catch (error) {
      setMessage('Error saving property: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = (property) => {
    setPropertyForm({
      title: property.title,
      description: property.description,
      city: property.city,
      price: property.price,
      categories: property.categories,
      featured: property.featured,
      status: property.status
    });
    setEditingProperty(property);
    setActiveTab('add-property');
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.delete(id);
        setMessage('Property deleted successfully!');
        fetchProperties();
      } catch (error) {
        setMessage('Error deleting property');
      }
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      setMessage('Please select a logo file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('logo', logoFile);
      
      await adminAPI.uploadLogo(formData);
      setMessage('Logo uploaded successfully!');
      setLogoFile(null);
      document.getElementById('logo-upload').value = '';
      fetchLogo();
    } catch (error) {
      setMessage('Error uploading logo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const categoryOptions = ['Upcoming Project', 'New Launch', 'Luxury Homes', 'All Property'];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      {message && (
        <div style={{ 
          background: message.includes('Error') ? '#f8d7da' : '#d4edda',
          color: message.includes('Error') ? '#721c24' : '#155724',
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {message}
          <button 
            onClick={() => setMessage('')}
            style={{ float: 'right', background: 'none', border: 'none', fontSize: '16px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #eee', 
        marginBottom: '30px' 
      }}>
        <button
          onClick={() => setActiveTab('properties')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'properties' ? '#007bff' : 'transparent',
            color: activeTab === 'properties' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          Manage Properties
        </button>
        <button
          onClick={() => setActiveTab('add-property')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'add-property' ? '#007bff' : 'transparent',
            color: activeTab === 'add-property' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          {editingProperty ? 'Edit Property' : 'Add Property'}
        </button>
        <button
          onClick={() => setActiveTab('logo')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'logo' ? '#007bff' : 'transparent',
            color: activeTab === 'logo' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          Company Logo
        </button>
      </div>

      {/* Properties Management Tab */}
      {activeTab === 'properties' && (
        <div>
          <h2>All Properties ({properties.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : properties.length === 0 ? (
            <div className="card">
              <p>No properties found. Add your first property!</p>
            </div>
          ) : (
            <div className="grid">
              {properties.map((property) => (
                <div key={property._id} className="card">
                  {property.images.length > 0 && (
                    <img
                      src={`http://localhost:5000/uploads/${property.images[0]}`}
                      alt={property.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '15px' }}
                    />
                  )}
                  <h3>{property.title}</h3>
                  <p>{property.description.substring(0, 100)}...</p>
                  <p><strong>City:</strong> {property.city}</p>
                  <p><strong>Price:</strong> {property.price}</p>
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
                  {property.featured && (
                    <p style={{ color: '#28a745', fontWeight: 'bold' }}>⭐ Featured</p>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      onClick={() => handleEditProperty(property)}
                      className="btn"
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property._id)}
                      className="btn"
                      style={{ background: '#dc3545', flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Property Tab */}
      {activeTab === 'add-property' && (
        <div>
          <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
          {editingProperty && (
            <button 
              onClick={() => {
                setEditingProperty(null);
                setPropertyForm({
                  title: '',
                  description: '',
                  city: '',
                  price: '',
                  categories: [],
                  featured: false,
                  status: 'Available'
                });
              }}
              className="btn btn-secondary"
              style={{ marginBottom: '20px' }}
            >
              Cancel Edit
            </button>
          )}
          <div className="card">
            <form onSubmit={handlePropertySubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={propertyForm.title}
                  onChange={handlePropertyFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={propertyForm.description}
                  onChange={handlePropertyFormChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={propertyForm.city}
                    onChange={handlePropertyFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    name="price"
                    value={propertyForm.price}
                    onChange={handlePropertyFormChange}
                    placeholder="e.g., ₹50 Lakhs or Price on Request"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={propertyForm.status}
                    onChange={handlePropertyFormChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                  {categoryOptions.map((category) => (
                    <label key={category} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="checkbox"
                        name="categories"
                        value={category}
                        checked={propertyForm.categories.includes(category)}
                        onChange={handlePropertyFormChange}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={propertyForm.featured}
                    onChange={handlePropertyFormChange}
                  />
                  Mark as Featured Property
                </label>
              </div>

              <div className="form-group">
                <label>Property Images</label>
                <input
                  type="file"
                  id="property-images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Select multiple images (max 10). First image will be the main display image.
                </small>
              </div>

              <button 
                type="submit" 
                className="btn" 
                disabled={loading}
                style={{ width: '100%', padding: '15px' }}
              >
                {loading ? 'Saving...' : (editingProperty ? 'Update Property' : 'Add Property')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Logo Management Tab */}
      {activeTab === 'logo' && (
        <div>
          <h2>Company Logo</h2>
          <div className="card">
            <h3>Current Logo</h3>
            {logo ? (
              <div style={{ marginBottom: '30px' }}>
                <img 
                  src={`http://localhost:5000${logo}`} 
                  alt="Company Logo" 
                  style={{ maxHeight: '100px', marginBottom: '10px' }}
                />
                <p>Logo is currently set</p>
              </div>
            ) : (
              <p>No logo uploaded yet</p>
            )}

            <h3>Upload New Logo</h3>
            <form onSubmit={handleLogoUpload}>
              <div className="form-group">
                <label>Choose Logo File</label>
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Recommended: PNG format, transparent background, max 200x60px
                </small>
              </div>
              <button 
                type="submit" 
                className="btn"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Logo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
