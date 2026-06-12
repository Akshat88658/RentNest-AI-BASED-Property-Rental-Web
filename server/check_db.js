const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('./models/Property');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB successfully!');
    const total = await Property.countDocuments({});
    console.log('Total properties in DB:', total);
    const byStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    console.log('Properties grouped by status:', byStatus);
    const sample = await Property.find({}).limit(5).select('title status images');
    console.log('Sample properties:', JSON.stringify(sample, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to DB:', err);
    process.exit(1);
  }
}

run();
