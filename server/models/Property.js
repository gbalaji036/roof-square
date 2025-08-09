const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: String,
    default: 'Price on Request'
  },
  categories: [{
    type: String,
    enum: ['Upcoming Project', 'New Launch', 'Luxury Homes', 'All Property']
  }],
  images: [String],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Under Construction'],
    default: 'Available'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
