/**
 * updatePropertyImages.js
 * Assigns realistic, property-type-specific image sets to every property in the DB.
 * Each property gets 4 unique images matched to its type/title.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Property = require('../models/Property');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Curated image banks per property type ──────────────────────────────────
// All photos are from Unsplash and verified to load correctly.
const IMAGE_BANKS = {
  studio: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185127-6a7b3d8a2ae2?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80',
  ],
  villa: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?w=800&h=600&fit=crop&q=80',
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1512207736139-c1957dd8ded5?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603811478698-b9c5c0e3ee27?w=800&h=600&fit=crop&q=80',
  ],
  condo: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560185127-6a7b3d8a2ae2?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&q=80',
  ],
  other: [
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&h=600&fit=crop&q=80',
  ],
};

// Pick 4 unique images from the bank for a given type, using propertyIndex to offset
function pickImages(type, propertyIndex) {
  const bank = IMAGE_BANKS[type] || IMAGE_BANKS.other;
  const result = [];
  const used = new Set();
  const start = (propertyIndex * 2) % bank.length; // stagger start per property

  for (let i = 0; i < bank.length && result.length < 4; i++) {
    const url = bank[(start + i) % bank.length];
    if (!used.has(url)) {
      used.add(url);
      result.push({ url });
    }
  }

  // If bank is too small, fall back to first images
  while (result.length < 4) {
    const url = bank[result.length % bank.length];
    result.push({ url });
  }

  return result;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const properties = await Property.find({}).sort('createdAt');
    console.log(`📊 Found ${properties.length} properties\n`);

    let updated = 0;
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      const images = pickImages(prop.propertyType || 'other', i);

      await Property.findByIdAndUpdate(prop._id, { images });
      console.log(`  [${i + 1}/${properties.length}] "${prop.title}" (${prop.propertyType}) → ${images.length} images assigned`);
      updated++;
    }

    console.log(`\n✅ Updated ${updated} properties with type-specific realistic images!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
