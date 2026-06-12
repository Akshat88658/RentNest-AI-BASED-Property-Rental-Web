const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

dotenv.config();

const propertiesToRemove = [
  'Artist Studio Apartment',
  'Beach View Apartment',
  'Cozy 1BHK Near University'
];

async function removeProperties() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    for (let title of propertiesToRemove) {
      const result = await Property.findOneAndDelete({ title });
      if (result) {
        console.log(`✅ Removed: ${title}`);
      } else {
        console.log(`⚠️  Not found: ${title}`);
      }
    }

    // Get total count
    const totalCount = await Property.countDocuments();
    console.log(`\n📊 Total properties remaining: ${totalCount}`);

    const remaining = await Property.find({}).select('title propertyType price');
    console.log('\nRemaining properties:');
    remaining.forEach((prop, index) => {
      console.log(`  ${index + 1}. ${prop.title} - ₹${prop.price.amount}/month`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

removeProperties();
