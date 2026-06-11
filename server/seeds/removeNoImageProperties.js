const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const Review = require('../models/Review');

dotenv.config();

async function removeNoImageProperties() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // Find all properties
    const allProperties = await Property.find({});
    console.log(`📊 Total properties in DB: ${allProperties.length}`);

    // Identify properties with no images or empty images array
    const noImageProperties = allProperties.filter((prop) => {
      const hasNoImages = !prop.images || prop.images.length === 0;
      const hasOnlyEmptyImages = prop.images && prop.images.length > 0 &&
        prop.images.every((img) => !img.url || img.url.trim() === '');
      return hasNoImages || hasOnlyEmptyImages;
    });

    console.log(`🔍 Properties with no images: ${noImageProperties.length}`);

    if (noImageProperties.length === 0) {
      console.log('✅ All properties have images. Nothing to remove.');
      process.exit(0);
    }

    // Log which properties will be removed
    console.log('\n📋 Properties to be removed:');
    noImageProperties.forEach((prop, i) => {
      console.log(`  ${i + 1}. "${prop.title}" (ID: ${prop._id}) - Images: ${prop.images?.length ?? 0}`);
    });

    // Delete associated reviews first
    const propertyIds = noImageProperties.map((p) => p._id);
    const deletedReviews = await Review.deleteMany({ property: { $in: propertyIds } });
    console.log(`\n🗑️  Deleted ${deletedReviews.deletedCount} associated reviews`);

    // Delete the properties
    const deletedProperties = await Property.deleteMany({ _id: { $in: propertyIds } });
    console.log(`🗑️  Deleted ${deletedProperties.deletedCount} properties with no images`);

    // Verify remaining
    const remaining = await Property.countDocuments({});
    console.log(`\n✅ Done! ${remaining} properties remain in the database.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeNoImageProperties();
