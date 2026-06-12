const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

const properties = [
  {
    title: 'Cozy Studio Near Tech Park',
    description: 'Perfect studio apartment for professionals working in tech. Located near Tech Park with easy access to metro. Fully furnished with modern amenities. Great natural light and cozy atmosphere.',
    propertyType: 'studio',
    price: { amount: 15000, currency: 'INR', period: 'monthly' },
    location: {
      address: '123 Tech Avenue, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      area: 300,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen', 'Study Area'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1489599849228-bed96d3a5ffe?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Luxury 2BHK Apartment Downtown',
    description: 'Spacious and luxurious 2 bedroom apartment in the heart of downtown. Modern amenities, high-speed internet, and stunning city views. Perfect for families or professionals.',
    propertyType: 'apartment',
    price: { amount: 45000, currency: 'INR', period: 'monthly' },
    location: {
      address: '456 Downtown Plaza, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Gym', 'Pool', 'WiFi', '24/7 Security', 'Parking', 'Elevator'],
    images: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Modern 3BHK Villa with Garden',
    description: 'Beautiful 3 bedroom villa with spacious garden and parking. Modern architecture with traditional touch. Ideal for families wanting privacy and space.',
    propertyType: 'villa',
    price: { amount: 80000, currency: 'INR', period: 'monthly' },
    location: {
      address: '789 Garden Lane, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: { lat: 28.7041, lng: 77.1025 }
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      furnished: 'semi-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Garden', 'Garage', 'Terrace', 'Kitchen', 'WiFi', 'Security Gate'],
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Cozy 1BHK Near University',
    description: 'Perfect for students and young professionals. Affordable 1 bedroom apartment close to university campus. Fully furnished with all necessary amenities.',
    propertyType: 'apartment',
    price: { amount: 18000, currency: 'INR', period: 'monthly' },
    location: {
      address: '321 University Road, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      furnished: 'fully-furnished',
      parking: false,
      petFriendly: false
    },
    amenities: ['WiFi', 'AC', 'Water Cooler', 'Study Table', 'Kitchen'],
    images: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Premium Penthouse with City View',
    description: 'Exclusive penthouse with breathtaking city views. Top-floor luxury apartment with modern design and premium finishes. Rooftop terrace included.',
    propertyType: 'penthouse',
    price: { amount: 150000, currency: 'INR', period: 'monthly' },
    location: {
      address: '999 Sky Tower, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560080',
      coordinates: { lat: 12.9752, lng: 77.6245 }
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 3500,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Rooftop Terrace', 'Home Theater', 'Gym', 'Wine Cellar', 'Smart Home', 'Concierge'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512207736139-c1957dd8ded5?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Spacious House with Backyard',
    description: 'Charming 2 bedroom house with large backyard. Great for families. Close to schools and markets. Quiet neighborhood with friendly community.',
    propertyType: 'house',
    price: { amount: 35000, currency: 'INR', period: 'monthly' },
    location: {
      address: '555 Suburban Lane, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500001',
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      furnished: 'semi-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Backyard', 'Garage', 'Kitchen Garden', 'Porch', 'Playground'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Elegant Condo in Prime Location',
    description: 'Sophisticated 2 bedroom condo in a prime location. Walking distance to shops, restaurants, and entertainment. Modern amenities and excellent maintenance.',
    propertyType: 'condo',
    price: { amount: 55000, currency: 'INR', period: 'monthly' },
    location: {
      address: '222 Business District, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['Elevator', 'Security', 'Parking', 'Gym', 'Lounge', 'WiFi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&q=80' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80' }
    ],
    status: 'available'
  }
];

async function seedProperties() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Find an admin user to use as owner
    let owner = await User.findOne({ role: 'admin' });

    if (!owner) {
      // Create a demo user if no admin exists
      owner = await User.create({
        name: 'Demo Owner',
        email: 'owner@demo.com',
        password: 'password123',
        role: 'landlord',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'
      });
      console.log('Created demo owner:', owner._id);
    }

    // Add owner ID to all properties
    const propertiesWithOwner = properties.map(prop => ({
      ...prop,
      owner: owner._id
    }));

    // Delete existing properties (optional)
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Insert new properties
    const inserted = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ Successfully seeded ${inserted.length} properties!`);

    inserted.forEach((prop, index) => {
      console.log(`  ${index + 1}. ${prop.title} (${prop.propertyType}) - ₹${prop.price.amount}/month`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seed
seedProperties();
