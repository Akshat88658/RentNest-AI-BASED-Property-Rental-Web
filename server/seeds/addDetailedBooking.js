const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

dotenv.config();

const detailedProperties = [
  {
    title: 'Cozy Studio Near Tech Park',
    description: 'Perfect studio apartment for professionals working in tech. Located near Tech Park with easy access to metro. Fully furnished with modern amenities. Great natural light and cozy atmosphere. This charming studio is ideal for working professionals who value convenience and modern living. The space is thoughtfully designed to maximize comfort with high-quality furnishings.',
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
    }
  },
  {
    title: 'Luxury 2BHK Apartment Downtown',
    description: 'Spacious and luxurious 2 bedroom apartment in the heart of downtown. Modern amenities, high-speed internet, and stunning city views. Perfect for families or professionals. This premium property features premium finishes, designer furniture, and state-of-the-art appliances. Located in a prestigious building with 24/7 security and world-class amenities.',
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
    }
  },
  {
    title: 'Modern 3BHK Villa with Garden',
    description: 'Beautiful 3 bedroom villa with spacious garden and parking. Modern architecture with traditional touch. Ideal for families wanting privacy and space. This stunning villa offers the perfect blend of luxury and comfort with premium amenities and lush landscaping. Private entrance, dedicated parking, and a serene environment make it perfect for families.',
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
    }
  },
  {
    title: 'Premium Penthouse with City View',
    description: 'Exclusive penthouse with breathtaking city views. Top-floor luxury apartment with modern design and premium finishes. Rooftop terrace included. This ultra-luxury property offers an unparalleled living experience with panoramic views, smart home automation, and concierge service. Perfect for those seeking the finest in urban living.',
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
    }
  },
  {
    title: 'Elegant Condo in Prime Location',
    description: 'Sophisticated 2 bedroom condo in a prime location. Walking distance to shops, restaurants, and entertainment. Modern amenities and excellent maintenance. This elegant property is perfect for professionals and small families. Located in a vibrant neighborhood with excellent connectivity and lifestyle amenities at your doorstep.',
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
    }
  },
  {
    title: 'Modern Loft in Arts District',
    description: 'Trendy loft apartment in the vibrant arts district. High ceilings, exposed brick, and artistic vibes. Perfect for creatives and young professionals. This unique space combines industrial charm with modern comfort. Surrounded by galleries, cafes, and cultural venues. The perfect creative hub for artists and designers.',
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
    }
  },
  {
    title: 'Green Living - Eco Apartment',
    description: 'Sustainable and eco-friendly apartment with solar panels and water harvesting. Perfect for environmentally conscious renters. Modern green living with all amenities. This property demonstrates commitment to sustainability with renewable energy, water conservation, and eco-friendly materials. Live responsibly without compromising on comfort and style.',
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
    }
  },
  {
    title: 'Luxury Serviced Apartment',
    description: 'Premium serviced apartment with housekeeping, laundry, and room service. Hotel-like amenities with residential comfort. Perfect for executives and corporate rentals. This luxurious apartment provides all the conveniences of a 5-star hotel with the comfort of a home. Ideal for business travelers and relocating professionals.',
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
    }
  },
  {
    title: 'Converted Warehouse Loft',
    description: 'Stunning converted warehouse with industrial charm. Open spaces, skylights, and modern installations. Unique living experience in creative community. This magnificent loft preserves the warehouse\'s industrial heritage while offering all modern comforts. Perfect for those seeking character and uniqueness with contemporary amenities.',
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
    }
  },
  {
    title: 'Family Villa with Pool',
    description: 'Spacious family villa with private swimming pool and landscaped garden. Perfect for families looking for space and privacy. Great community with excellent schools and amenities nearby. This beautiful villa is designed for family comfort with plenty of outdoor space for children to play and relax.',
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
    }
  },
  {
    title: 'Smart Home Tech Apartment',
    description: 'State-of-the-art smart home apartment with IoT devices. Control everything from your phone - lights, temperature, security. Future of living starts here. Experience cutting-edge technology seamlessly integrated into comfortable living. Perfect for tech enthusiasts who want their home to be as intelligent as they are.',
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
    }
  },
  {
    title: 'Boutique Hotel Apartment',
    description: 'Boutique-style apartment in a heritage building. Blends old-world charm with modern comfort. Perfect for those who appreciate design and aesthetics. This unique property honors its historical architecture while providing contemporary luxuries. Stay in a piece of history with all modern conveniences.',
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
    }
  }
];

async function updatePropertiesWithDetails() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected\n');

    for (let propData of detailedProperties) {
      const property = await Property.findOneAndUpdate(
        { title: propData.title },
        {
          description: propData.description,
          amenities: propData.amenities,
          bookingDetails: propData.bookingDetails
        },
        { new: true }
      );

      if (property) {
        console.log(`✅ Updated: ${property.title}`);
        console.log(`   • Amenities: ${property.amenities.length} added`);
        console.log(`   • Min Stay: ${property.bookingDetails.minStay} day(s)`);
        console.log(`   • Security Deposit: ₹${property.bookingDetails.securityDeposit}\n`);
      }
    }

    console.log('✅ All properties updated with detailed booking information!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updatePropertiesWithDetails();
