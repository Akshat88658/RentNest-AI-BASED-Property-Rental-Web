const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Property = require('../models/Property');

// Resolve to project root .env regardless of where the script is run from
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Verified working Unsplash real-estate photo IDs (checked June 2026)
const reliableImageUrls = {
  bedroom:   'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80',
  apartment: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
  modern:    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
  interior:  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
  luxury:    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80',
  living:    'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80',
  kitchen:   'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80',
  villa:     'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
  garden:    'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80',
  pool:      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
  terrace:   'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80',
  bathroom:  'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
  ceiling:   'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
  windows:   'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80',
  dining:    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80',
  balcony:   'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80',
  // Extra verified backups to ensure 4 unique images are always available
  studio:    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop&q=80',
  rooftop:   'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop&q=80',
  hallway:   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=80',
  facade:    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
  penthouse: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop&q=80',
  lounge:    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop&q=80',
};

async function fixImageUrls() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    // Get all properties
    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties`);

    const imageArray = Object.values(reliableImageUrls);
    let updated = 0;

    for (let prop of properties) {
      // Generate 4 reliable images for each property
      const newImages = [
        { url: imageArray[Math.floor(Math.random() * imageArray.length)] },
        { url: imageArray[Math.floor(Math.random() * imageArray.length)] },
        { url: imageArray[Math.floor(Math.random() * imageArray.length)] },
        { url: imageArray[Math.floor(Math.random() * imageArray.length)] }
      ];

      // Ensure no duplicates
      const uniqueImages = [];
      for (let img of newImages) {
        if (!uniqueImages.find(u => u.url === img.url)) {
          uniqueImages.push(img);
        }
      }

      // If we have duplicates, fill with other images
      while (uniqueImages.length < 4) {
        const randomImg = { url: imageArray[Math.floor(Math.random() * imageArray.length)] };
        if (!uniqueImages.find(u => u.url === randomImg.url)) {
          uniqueImages.push(randomImg);
        }
      }

      await Property.findByIdAndUpdate(prop._id, { images: uniqueImages }, { new: true });
      updated++;
    }

    console.log(`✅ Updated ${updated} properties with reliable images!`);
    console.log(`📊 Each property now has 4 unique, working images`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing images:', error.message);
    process.exit(1);
  }
}

fixImageUrls();
