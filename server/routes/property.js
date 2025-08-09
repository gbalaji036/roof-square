const express = require('express');
const Property = require('../models/Property');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const { category, city, featured } = req.query;
    let filter = {};
    
    if (category) filter.categories = category;
    if (city) filter.city = new RegExp(city, 'i');
    if (featured) filter.featured = featured === 'true';
    
    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new property (Admin only)
router.post('/add', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, city, price, categories, featured, status } = req.body;
    
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    const property = new Property({
      title,
      description,
      city,
      price,
      categories: Array.isArray(categories) ? categories : [categories],
      images,
      featured: featured === 'true',
      status
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update property (Admin only)
router.put('/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, city, price, categories, featured, status } = req.body;
    
    const updateData = {
      title,
      description,
      city,
      price,
      categories: Array.isArray(categories) ? categories : [categories],
      featured: featured === 'true',
      status
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.filename);
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete property (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
