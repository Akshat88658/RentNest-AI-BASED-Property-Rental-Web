const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

const moreProperties = [
  {
    title: 'Modern Loft in Arts District',
    description: 'Trendy loft apartment in the vibrant arts district. High ceilings, exposed brick, and artistic vibes. Perfect for creatives and young professionals.',
    propertyType: 'apartment',
    price: { amount: 42000, currency: 'INR', period: 'monthly' },
    location: {
      address: '111 Art Street, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: { lat: 12.9698, lng: 77.6357 }
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 700,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['High Ceilings', 'Natural Light', 'Exposed Brick', 'Kitchen', 'WiFi', 'Art Community'],
    images: [
      { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Beach View Apartment',
    description: 'Beautiful apartment with stunning beach views. Wake up to the sound of waves every morning. Perfect beach lifestyle with modern amenities.',
    propertyType: 'apartment',
    price: { amount: 65000, currency: 'INR', period: 'monthly' },
    location: {
      address: '222 Beachfront Road, Goa',
      city: 'Goa',
      state: 'Goa',
      pincode: '403516',
      coordinates: { lat: 15.2993, lng: 73.8243 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1300,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Beach Access', 'Balcony', 'Kitchen', 'AC', 'WiFi', 'Parking'],
    images: [
      { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Green Living - Eco Apartment',
    description: 'Sustainable and eco-friendly apartment with solar panels and water harvesting. Perfect for environmentally conscious renters. Modern green living.',
    propertyType: 'apartment',
    price: { amount: 38000, currency: 'INR', period: 'monthly' },
    location: {
      address: '333 Green Lane, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      coordinates: { lat: 18.5204, lng: 73.8567 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['Solar Power', 'Water Harvesting', 'Garden', 'Composting', 'WiFi', 'Gym'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Luxury Serviced Apartment',
    description: 'Premium serviced apartment with housekeeping, laundry, and room service. Hotel-like amenities with residential comfort. Perfect for executives.',
    propertyType: 'apartment',
    price: { amount: 75000, currency: 'INR', period: 'monthly' },
    location: {
      address: '444 Business Tower, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      coordinates: { lat: 19.0176, lng: 72.8479 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['Housekeeping', 'Laundry', 'Room Service', 'Concierge', 'Gym', 'Pool'],
    images: [
      { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Converted Warehouse Loft',
    description: 'Stunning converted warehouse with industrial charm. Open spaces, skylights, and modern installations. Unique living experience in creative community.',
    propertyType: 'apartment',
    price: { amount: 55000, currency: 'INR', period: 'monthly' },
    location: {
      address: '555 Industrial Avenue, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110026',
      coordinates: { lat: 28.5244, lng: 77.2458 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1600,
      furnished: 'semi-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['High Ceilings', 'Skylights', 'Modern Art', 'Kitchen', 'Workspace', 'Parking'],
    images: [
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Family Villa with Pool',
    description: 'Spacious family villa with private swimming pool and landscaped garden. Perfect for families looking for space and privacy. Great community.',
    propertyType: 'villa',
    price: { amount: 95000, currency: 'INR', period: 'monthly' },
    location: {
      address: '666 Luxury Lane, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500082',
      coordinates: { lat: 17.3850, lng: 78.4867 }
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      furnished: 'semi-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Swimming Pool', 'Garden', 'Garage', 'Playground', 'Kitchen', 'Terrace'],
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Smart Home Tech Apartment',
    description: 'State-of-the-art smart home apartment with IoT devices. Control everything from your phone - lights, temperature, security. Future of living.',
    propertyType: 'apartment',
    price: { amount: 68000, currency: 'INR', period: 'monthly' },
    location: {
      address: '777 Tech Park, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['Smart Lights', 'Smart AC', 'Smart Lock', 'CCTV', 'IoT Kitchen', 'High Speed WiFi'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Artist Studio Apartment',
    description: 'Creative artist studio apartment with large windows for natural light. Perfect for painters, designers, and creative professionals. Gallery space included.',
    propertyType: 'studio',
    price: { amount: 28000, currency: 'INR', period: 'monthly' },
    location: {
      address: '888 Artist Lane, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560029',
      coordinates: { lat: 12.9689, lng: 77.5941 }
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      area: 600,
      furnished: 'semi-furnished',
      parking: true,
      petFriendly: true
    },
    amenities: ['Large Windows', 'Gallery Space', 'Work Area', 'Kitchenette', 'Storage', 'Parking'],
    images: [
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  },
  {
    title: 'Boutique Hotel Apartment',
    description: 'Boutique-style apartment in a heritage building. Blends old-world charm with modern comfort. Perfect for those who appreciate design and aesthetics.',
    propertyType: 'apartment',
    price: { amount: 52000, currency: 'INR', period: 'monthly' },
    location: {
      address: '999 Heritage Street, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600002',
      coordinates: { lat: 13.0489, lng: 80.2506 }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1000,
      furnished: 'fully-furnished',
      parking: true,
      petFriendly: false
    },
    amenities: ['Heritage Design', 'Rooftop Access', 'Library', 'Lounge', 'Café', 'Concierge'],
    images: [
      { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
      { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
    ],
    status: 'available'
  }
];

async function seedMoreProperties() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Find admin user
    let owner = await User.findOne({ role: 'admin' });

    if (!owner) {
      owner = await User.findOne({});
    }

    if (!owner) {
      throw new Error('No user found in database');
    }

    const propertiesWithOwner = moreProperties.map(prop => ({
      ...prop,
      owner: owner._id
    }));

    const inserted = await Property.insertMany(propertiesWithOwner);
    console.log(`✅ Successfully added ${inserted.length} more properties!`);

    inserted.forEach((prop, index) => {
      console.log(`  ${index + 1}. ${prop.title} (${prop.propertyType}) - ₹${prop.price.amount}/month`);
    });

    // Get total count
    const totalCount = await Property.countDocuments();
    console.log(`\n📊 Total properties in database: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding properties:', error.message);
    process.exit(1);
  }
}

seedMoreProperties();
