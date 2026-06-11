const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');
const Property = require('../models/Property');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const connectDB = require('./db');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Review.deleteMany();
    await Booking.deleteMany();
    console.log('🗑️  Existing data (Users, Properties, Reviews, Bookings) cleared.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Users (Admin, Landlord, Tenants)
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@airental.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      },
      {
        name: 'John Landlord',
        email: 'landlord@airental.com',
        password: hashedPassword,
        role: 'landlord',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      {
        name: 'Jane Tenant',
        email: 'tenant@airental.com',
        password: hashedPassword,
        role: 'tenant',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      },
      {
        name: 'Alice Smith',
        email: 'tenant2@airental.com',
        password: hashedPassword,
        role: 'tenant',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
      },
      {
        name: 'Bob Johnson',
        email: 'tenant3@airental.com',
        password: hashedPassword,
        role: 'tenant',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
      },
      {
        name: 'Charlie Davis',
        email: 'tenant4@airental.com',
        password: hashedPassword,
        role: 'tenant',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
      }
    ]);

    const landlordId = users[1]._id;
    const tenantIds = [users[2]._id, users[3]._id, users[4]._id, users[5]._id];

    // 2. Comprehensive properties list (16 properties)
    const propertiesData = [
      {
        title: 'Cozy Studio Near Tech Park',
        description: 'Perfect studio apartment for professionals working in tech. Located near Tech Park with easy access to metro. Fully furnished with modern amenities. Great natural light and cozy atmosphere. This charming studio is ideal for working professionals who value convenience and modern living. The space is thoughtfully designed to maximize comfort with high-quality furnishings.',
        propertyType: 'studio',
        status: 'available',
        isVerified: true,
        price: { amount: 15000, currency: 'INR', period: 'monthly' },
        location: {
          address: '123 Tech Avenue, Whitefield',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        features: { bedrooms: 0, bathrooms: 1, area: 300, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['WiFi', 'AC', 'Washing Machine', 'Kitchen', 'Study Area', 'Parking', 'CCTV Security', 'Daily Housekeeping'],
        bookingDetails: {
          minStay: 1,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 7 days before check-in',
          securityDeposit: 30000,
          extraCharges: 'No extra charges for 1 guest. Additional guest: ₹5,000/month',
          houseRules: ['No smoking', 'No loud music after 10 PM', 'Pets allowed with prior approval']
        },
        aiDescription: 'Ideal studio option for tech professionals in Whitefield. Features optimized layout, fast 200 Mbps Wi-Fi, and convenient proximity to IT parks. High energy efficiency and professional management make it highly recommended.',
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1527482797697-8795b1a55a45?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Luxury 2BHK Apartment Downtown',
        description: 'Spacious and luxurious 2 bedroom apartment in the heart of downtown. Modern amenities, high-speed internet, and stunning city views. Perfect for families or professionals. This premium property features premium finishes, designer furniture, and state-of-the-art appliances. Located in a prestigious building with 24/7 security and world-class amenities.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 45000, currency: 'INR', period: 'monthly' },
        location: {
          address: '456 Downtown Plaza, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1200, furnished: 'fully-furnished', parking: true, petFriendly: true },
        amenities: ['Gym', 'Pool', 'WiFi', '24/7 Security', 'Parking', 'Elevator', 'Air Purifier', 'Microwave', 'Dishwasher', 'Smart TV'],
        bookingDetails: {
          minStay: 3,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: '50% refund if cancelled 14 days before check-in',
          securityDeposit: 90000,
          extraCharges: 'Utilities included. Extra guest: ₹8,000/month. Housekeeping: ₹2,000/session',
          houseRules: ['No smoking indoors', 'No pets without prior approval', 'Quiet hours: 10 PM - 8 AM', 'No commercial activities']
        },
        aiDescription: 'Stunning premium 2BHK listing in high-demand Bandra West. Showcases outstanding skyline views, integrated automation, and building gym/pool facilities. Excellent natural light throughout the day.',
        images: [
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Modern 3BHK Villa with Garden',
        description: 'Beautiful 3 bedroom villa with spacious garden and parking. Modern architecture with traditional touch. Ideal for families wanting privacy and space. This stunning villa offers the perfect blend of luxury and comfort with premium amenities and lush landscaping. Private entrance, dedicated parking, and a serene environment make it perfect for families.',
        propertyType: 'villa',
        status: 'available',
        isVerified: true,
        price: { amount: 80000, currency: 'INR', period: 'monthly' },
        location: {
          address: '789 Garden Lane, Vasant Kunj',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110070',
          coordinates: { lat: 28.7041, lng: 77.1025 }
        },
        features: { bedrooms: 3, bathrooms: 3, area: 2500, furnished: 'semi-furnished', parking: true, petFriendly: true },
        amenities: ['Garden', 'Garage', 'Terrace', 'Kitchen', 'WiFi', 'Security Gate', 'Lawn Maintenance', 'Water Tank', 'Solar Power'],
        bookingDetails: {
          minStay: 6,
          maxStay: 365,
          checkIn: '1:00 PM',
          checkOut: '12:00 PM',
          cancellationPolicy: 'Non-refundable deposit, free cancellation 30 days before',
          securityDeposit: 160000,
          extraCharges: 'Utilities: ₹5,000-8,000/month. Maintenance: included. Extra guest: ₹5,000/month',
          houseRules: ['No parties or loud events', 'Maintain garden', 'Report maintenance issues promptly', 'No commercial use']
        },
        aiDescription: 'Spacious family villa in secure Vasant Kunj. Integrates eco-friendly solar setups, manicured private lawn, and double-car garage. Offers high privacy and premium community security.',
        images: [
          { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Cozy 1BHK Near University',
        description: 'Perfect for students and young professionals. Affordable 1 bedroom apartment close to university campus. Fully furnished with all necessary amenities including high-speed internet and study space.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: false,
        price: { amount: 18000, currency: 'INR', period: 'monthly' },
        location: {
          address: '321 University Road, Deccan Gymkhana',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411004',
          coordinates: { lat: 18.5204, lng: 73.8567 }
        },
        features: { bedrooms: 1, bathrooms: 1, area: 450, furnished: 'fully-furnished', parking: false, petFriendly: false },
        amenities: ['WiFi', 'AC', 'Water Cooler', 'Study Table', 'Kitchen', 'CCTV Security'],
        bookingDetails: {
          minStay: 1,
          maxStay: 180,
          checkIn: '12:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 5 days before check-in',
          securityDeposit: 20000,
          extraCharges: 'No extra charges. Electricity as per sub-meter.',
          houseRules: ['No loud music', 'No smoking', 'For students/young professionals only']
        },
        aiDescription: 'Excellent student housing near major colleges in Pune. Economical rent includes high speed study Wi-Fi and air conditioning. Secured building access.',
        images: [
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Premium Penthouse with City View',
        description: 'Exclusive penthouse with breathtaking city views. Top-floor luxury apartment with modern design and premium finishes. Rooftop terrace included. This ultra-luxury property offers an unparalleled living experience with panoramic views, smart home automation, and concierge service. Perfect for those seeking the finest in urban living.',
        propertyType: 'penthouse',
        status: 'available',
        isVerified: true,
        price: { amount: 150000, currency: 'INR', period: 'monthly' },
        location: {
          address: '999 Sky Tower, Indira Nagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560038',
          coordinates: { lat: 12.9752, lng: 77.6245 }
        },
        features: { bedrooms: 3, bathrooms: 3, area: 3500, furnished: 'fully-furnished', parking: true, petFriendly: true },
        amenities: ['Rooftop Terrace', 'Home Theater', 'Gym', 'Wine Cellar', 'Smart Home', 'Concierge', 'Spa Bath', 'Premium Kitchen', 'Elevator', '360° Views'],
        bookingDetails: {
          minStay: 12,
          maxStay: 365,
          checkIn: '3:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Non-refundable deposit, 60 days notice required',
          securityDeposit: 300000,
          extraCharges: 'All utilities included. Housekeeping: 5x weekly included. Extra services available',
          houseRules: ['Exclusive use property', 'Formal dress code for common areas', 'Concierge coordination required for events', 'Premium membership required']
        },
        aiDescription: 'Stunning luxury penthouse in central Indira Nagar. Boasts exclusive private rooftop, home automation suite, spa baths, and top-tier materials. Fits discerning executives.',
        images: [
          { url: 'https://images.unsplash.com/photo-1512207736139-c1957dd8ded5?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Spacious House with Backyard',
        description: 'Charming 2 bedroom house with large backyard. Great for families. Close to schools and markets. Quiet neighborhood with friendly community. The house features a cozy kitchen, living area, and a safe green backyard for pets and children.',
        propertyType: 'house',
        status: 'available',
        isVerified: false,
        price: { amount: 35000, currency: 'INR', period: 'monthly' },
        location: {
          address: '555 Suburban Lane, Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500032',
          coordinates: { lat: 17.3850, lng: 78.4867 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1800, furnished: 'semi-furnished', parking: true, petFriendly: true },
        amenities: ['Backyard', 'Garage', 'Kitchen Garden', 'Porch', 'Playground', 'WiFi'],
        bookingDetails: {
          minStay: 6,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 14 days before check-in',
          securityDeposit: 70000,
          extraCharges: 'Gardener fee: ₹1,500/month.',
          houseRules: ['Maintain backyard cleanliness', 'No illegal activities', 'Pets allowed']
        },
        aiDescription: 'Excellent family home in suburban Gachibowli. Offers spacious yard, garage, and kid-friendly environment. Proximity to international schools is a major highlight.',
        images: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Elegant Condo in Prime Location',
        description: 'Sophisticated 2 bedroom condo in a prime location. Walking distance to shops, restaurants, and entertainment. Modern amenities and excellent maintenance. This elegant property is perfect for professionals and small families. Located in a vibrant neighborhood with excellent connectivity and lifestyle amenities at your doorstep.',
        propertyType: 'condo',
        status: 'available',
        isVerified: true,
        price: { amount: 55000, currency: 'INR', period: 'monthly' },
        location: {
          address: '222 Business District, T Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600017',
          coordinates: { lat: 13.0489, lng: 80.2506 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1400, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['Elevator', 'Security', 'Parking', 'Gym', 'Lounge', 'WiFi', 'Air Purifier', 'Modular Kitchen', 'Washing Machine', 'Balcony'],
        bookingDetails: {
          minStay: 2,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: '30% refund if cancelled 10 days before',
          securityDeposit: 110000,
          extraCharges: 'Utilities: ₹3,000-4,000/month. Housekeeping: ₹1,500/session. Pet charge: ₹3,000/month',
          houseRules: ['Quiet hours after 10 PM', 'No large gatherings', 'Pets allowed with approval', 'Parking strictly assigned']
        },
        aiDescription: 'Centrally-located modern condo in T Nagar, Chennai. Walkable access to commercial hotspots. Furnished with energy-efficient appliances, modular kitchen, and smart air purification.',
        images: [
          { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Modern Loft in Arts District',
        description: 'Trendy loft apartment in the vibrant arts district. High ceilings, exposed brick, and artistic vibes. Perfect for creatives and young professionals. This unique space combines industrial charm with modern comfort. Surrounded by galleries, cafes, and cultural venues. The perfect creative hub for artists and designers.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 42000, currency: 'INR', period: 'monthly' },
        location: {
          address: '111 Art Street, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          coordinates: { lat: 12.9698, lng: 77.6357 }
        },
        features: { bedrooms: 1, bathrooms: 1, area: 700, furnished: 'fully-furnished', parking: true, petFriendly: true },
        amenities: ['High Ceilings', 'Natural Light', 'Exposed Brick', 'Kitchen', 'WiFi', 'Art Community', 'Gallery Space', 'Workspace', 'Parking'],
        bookingDetails: {
          minStay: 1,
          maxStay: 365,
          checkIn: '12:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Free cancellation up to 5 days before',
          securityDeposit: 84000,
          extraCharges: 'No utilities included. Utilities: ₹2,500-3,500/month. Guest pass: ₹500',
          houseRules: ['Respect artistic community', 'Keep noise levels reasonable', 'Parking on designated spots only', 'Art installations allowed']
        },
        aiDescription: 'Highly aesthetic warehouse loft in Indiranagar Arts district. Boasts exposed bricks, 15-foot high ceilings, study workspace, and community access to local galleries.',
        images: [
          { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Beach View Apartment',
        description: 'Beautiful apartment with stunning beach views. Wake up to the sound of waves every morning. Perfect beach lifestyle with modern amenities. It has a spacious balcony directly overlooking the sandy beaches of Anjuna, perfect for sunset views.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 65000, currency: 'INR', period: 'monthly' },
        location: {
          address: '222 Beachfront Road, Anjuna',
          city: 'Goa',
          state: 'Goa',
          pincode: '403509',
          coordinates: { lat: 15.5804, lng: 73.7423 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1300, furnished: 'fully-furnished', parking: true, petFriendly: true },
        amenities: ['Beach Access', 'Balcony', 'Kitchen', 'AC', 'WiFi', 'Parking', 'CCTV Security'],
        bookingDetails: {
          minStay: 3,
          maxStay: 90,
          checkIn: '1:00 PM',
          checkOut: '10:00 AM',
          cancellationPolicy: 'Full refund if cancelled 7 days before check-in',
          securityDeposit: 50000,
          extraCharges: 'Cleaning charges: ₹1,000 per stay.',
          houseRules: ['Wash sand off before entering', 'Quiet hours after 11 PM', 'Pets allowed with care']
        },
        aiDescription: 'Excellent beachfront property in Anjuna. Direct ocean front balcony, air conditioning, and walking distance to beachfront cafes. Exceptional option for remote workers.',
        images: [
          { url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Green Living - Eco Apartment',
        description: 'Sustainable and eco-friendly apartment with solar panels and water harvesting. Perfect for environmentally conscious renters. Modern green living with all amenities. This property demonstrates commitment to sustainability with renewable energy, water conservation, and eco-friendly materials. Live responsibly without compromising on comfort and style.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 38000, currency: 'INR', period: 'monthly' },
        location: {
          address: '333 Green Lane, Kalyani Nagar',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411006',
          coordinates: { lat: 18.5489, lng: 73.9006 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 950, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['Solar Power', 'Water Harvesting', 'Garden', 'Composting', 'WiFi', 'Gym', 'Recycling Program', 'Air Purifier', 'Smart Thermostat'],
        bookingDetails: {
          minStay: 3,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: '40% refund if cancelled 15 days before',
          securityDeposit: 76000,
          extraCharges: 'Utilities significantly reduced due to solar. Extra charges minimal.',
          houseRules: ['Follow eco-friendly practices', 'Use provided recycling bins', 'No plastic bags', 'Maintain garden area']
        },
        aiDescription: 'Environmentally-optimized property in Kalyani Nagar. Complete solar grid offsets electricity bills. Fitted with eco-appliances, composting system, and natural materials.',
        images: [
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Luxury Serviced Apartment',
        description: 'Premium serviced apartment with housekeeping, laundry, and room service. Hotel-like amenities with residential comfort. Perfect for executives and corporate rentals. This luxurious apartment provides all the conveniences of a 5-star hotel with the comfort of a home. Ideal for business travelers and relocating professionals.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 75000, currency: 'INR', period: 'monthly' },
        location: {
          address: '444 Business Tower, Worli',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400018',
          coordinates: { lat: 19.0176, lng: 72.8479 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1400, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['Housekeeping', 'Laundry', 'Room Service', 'Concierge', 'Gym', 'Pool', 'Restaurant', 'Business Center', 'WiFi', '24/7 Security'],
        bookingDetails: {
          minStay: 1,
          maxStay: 365,
          checkIn: 'Flexible',
          checkOut: 'Flexible',
          cancellationPolicy: 'No charge for cancellations',
          securityDeposit: 150000,
          extraCharges: 'All-inclusive: housekeeping daily, laundry, utilities, WiFi. Room service available',
          houseRules: ['Hotel standards maintained', 'Professional conduct expected', 'No parties', 'Corporate verification required']
        },
        aiDescription: 'Corporate grade serviced residence in prime Worli district. Features daily housekeeping, premium high-speed internet, concierge services, and building pool/dining.',
        images: [
          { url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Converted Warehouse Loft',
        description: 'Stunning converted warehouse with industrial charm. Open spaces, skylights, and modern installations. Unique living experience in creative community. This magnificent loft preserves the warehouse\'s industrial heritage while offering all modern comforts. Perfect for those seeking character and uniqueness with contemporary amenities.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 55000, currency: 'INR', period: 'monthly' },
        location: {
          address: '555 Industrial Avenue, Okhla',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110020',
          coordinates: { lat: 28.5244, lng: 77.2458 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1600, furnished: 'semi-furnished', parking: true, petFriendly: true },
        amenities: ['High Ceilings', 'Skylights', 'Modern Art', 'Kitchen', 'Workspace', 'Parking', 'Exposed Beams', 'Polished Concrete', 'Large Windows'],
        bookingDetails: {
          minStay: 2,
          maxStay: 365,
          checkIn: '1:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: 'Flexible - 7 days notice',
          securityDeposit: 110000,
          extraCharges: 'Utilities: ₹3,000-4,000/month. No housekeeping included. Studio rental available',
          houseRules: ['Respect architectural integrity', 'No structural modifications', 'Photography requests allowed', 'Art community welcome']
        },
        aiDescription: 'Exceptional warehouse loft conversion in Okhla. Highlighted by solid timber structures, polished concrete floors, tall gallery windows, and dedicated workspace.',
        images: [
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Family Villa with Pool',
        description: 'Spacious family villa with private swimming pool and landscaped garden. Perfect for families looking for space and privacy. Great community with excellent schools and amenities nearby. This beautiful villa is designed for family comfort with plenty of outdoor space for children to play and relax.',
        propertyType: 'villa',
        status: 'available',
        isVerified: true,
        price: { amount: 95000, currency: 'INR', period: 'monthly' },
        location: {
          address: '666 Luxury Lane, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033',
          coordinates: { lat: 17.4304, lng: 78.4067 }
        },
        features: { bedrooms: 4, bathrooms: 3, area: 3200, furnished: 'semi-furnished', parking: true, petFriendly: true },
        amenities: ['Swimming Pool', 'Garden', 'Garage', 'Playground', 'Kitchen', 'Terrace', 'Water Purifier', 'Security System', 'BBQ Area'],
        bookingDetails: {
          minStay: 6,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '12:00 PM',
          cancellationPolicy: 'Non-refundable deposit, flexible cancellation',
          securityDeposit: 190000,
          extraCharges: 'Pool maintenance: ₹3,000/month. Gardening: ₹2,000/month. Housekeeping available',
          houseRules: ['Pool safety rules strictly enforced', 'Supervision of children required', 'No commercial activities', 'Maintain property condition']
        },
        aiDescription: 'Exquisite 4BHK family villa in exclusive Jubilee Hills. Boasts a private filtration-equipped pool, security surveillance systems, outdoor brick BBQ, and playground.',
        images: [
          { url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Smart Home Tech Apartment',
        description: 'State-of-the-art smart home apartment with IoT devices. Control everything from your phone - lights, temperature, security. Future of living starts here. Experience cutting-edge technology seamlessly integrated into comfortable living. Perfect for tech enthusiasts who want their home to be as intelligent as they are.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 68000, currency: 'INR', period: 'monthly' },
        location: {
          address: '777 Tech Park, Outer Ring Road',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560103',
          coordinates: { lat: 12.9352, lng: 77.6245 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1100, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['Smart Lights', 'Smart AC', 'Smart Lock', 'CCTV', 'IoT Kitchen', 'High Speed WiFi', 'Robot Vacuum', 'Voice Assistant', 'Smart Curtains'],
        bookingDetails: {
          minStay: 2,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: '20% refund if cancelled 10 days before',
          securityDeposit: 136000,
          extraCharges: 'Premium WiFi included. Tech support: available. Extra device setup: ₹1,000',
          houseRules: ['Treat tech equipment with care', 'Report tech issues immediately', 'WiFi password sharing prohibited', 'No network overload']
        },
        aiDescription: 'IoT-enabled luxury apartment on Outer Ring Road. Integrated smart locks, smart thermostat climate controls, smart curtains, and robot helper schedules.',
        images: [
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Artist Studio Apartment',
        description: 'Creative artist studio apartment with large windows for natural light. Perfect for painters, designers, and creative professionals. Gallery space included.',
        propertyType: 'studio',
        status: 'available',
        isVerified: false,
        price: { amount: 28000, currency: 'INR', period: 'monthly' },
        location: {
          address: '888 Artist Lane, Malleshwaram',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560003',
          coordinates: { lat: 12.9989, lng: 77.5741 }
        },
        features: { bedrooms: 0, bathrooms: 1, area: 600, furnished: 'semi-furnished', parking: true, petFriendly: true },
        amenities: ['Large Windows', 'Gallery Space', 'Work Area', 'Kitchenette', 'Storage', 'Parking', 'WiFi'],
        bookingDetails: {
          minStay: 1,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '12:00 PM',
          cancellationPolicy: 'Flexible cancellation',
          securityDeposit: 40000,
          extraCharges: 'Studio setup fee: ₹2,000 (optional).',
          houseRules: ['Do not damage walls', 'Respect creative neighbors', 'No commercial shoots without permission']
        },
        aiDescription: 'Artistic loft space in Malleshwaram. Tall North-facing gallery windows invite excellent neutral lighting. Perfect workspace layout for artists.',
        images: [
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80' }
        ]
      },
      {
        title: 'Boutique Hotel Apartment',
        description: 'Boutique-style apartment in a heritage building. Blends old-world charm with modern comfort. Perfect for those who appreciate design and aesthetics. This unique property honors its historical architecture while providing contemporary luxuries. Stay in a piece of history with all modern conveniences.',
        propertyType: 'apartment',
        status: 'available',
        isVerified: true,
        price: { amount: 52000, currency: 'INR', period: 'monthly' },
        location: {
          address: '999 Heritage Street, Mylapore',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600004',
          coordinates: { lat: 13.0289, lng: 80.2606 }
        },
        features: { bedrooms: 2, bathrooms: 2, area: 1000, furnished: 'fully-furnished', parking: true, petFriendly: false },
        amenities: ['Heritage Design', 'Rooftop Access', 'Library', 'Lounge', 'Café', 'Concierge', 'Art Gallery', 'Heritage Tours', 'WiFi'],
        bookingDetails: {
          minStay: 3,
          maxStay: 365,
          checkIn: '2:00 PM',
          checkOut: '11:00 AM',
          cancellationPolicy: '50% refund if cancelled 14 days before',
          securityDeposit: 104000,
          extraCharges: 'Heritage tour included. Café meals optional. Parking: ₹2,000/month extra',
          houseRules: ['Respect historical property', 'No damage to heritage features', 'Photography for personal use only', 'Curated events available']
        },
        aiDescription: 'Restored colonial heritage home in historical Mylapore. High arches, teakwood fixtures, and rooftop garden access. Fully managed with butler/café options.',
        images: [
          { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80' },
          { url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80' }
        ]
      }
    ];

    const seededProperties = [];

    // Loop through properties and save them
    for (let prop of propertiesData) {
      prop.owner = landlordId;
      const createdProp = await Property.create(prop);
      seededProperties.push(createdProp);
    }
    console.log(`✅ Seeded ${seededProperties.length} highly detailed properties.`);

    // 3. Create mock reviews for each property from tenants
    const mockComments = [
      "Stunning place! The photos don't do it justice. Extremely clean and well maintained.",
      "Very convenient location. The amenities are top-notch and the landlord is very responsive.",
      "Decent place, but the parking was a bit tight. Overall a comfortable stay.",
      "Absolutely loved staying here! The AI descriptions were spot on. Highly recommend!",
      "Great experience. Quiet neighborhood and excellent security. Would book again.",
      "Clean, modern, and very comfortable. Had all the tech features as advertised."
    ];

    let reviewCount = 0;
    for (let property of seededProperties) {
      // Create 2-3 reviews per property
      const reviewers = tenantIds.slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3 reviewers
      let totalRating = 0;

      for (let tenantId of reviewers) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 star reviews to keep properties premium
        const comment = mockComments[Math.floor(Math.random() * mockComments.length)];
        
        await Review.create({
          property: property._id,
          user: tenantId,
          rating,
          comment
        });
        totalRating += rating;
        reviewCount++;
      }

      // Update property's rating/reviews count
      await Property.findByIdAndUpdate(property._id, {
        averageRating: Math.round((totalRating / reviewers.length) * 10) / 10,
        totalReviews: reviewers.length
      });
    }

    console.log(`✅ Seeded ${reviewCount} tenant reviews across properties.`);
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder error: ${error.stack || error.message}`);
    process.exit(1);
  }
};

seedDatabase();
