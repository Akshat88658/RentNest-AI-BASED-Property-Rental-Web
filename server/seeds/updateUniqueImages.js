const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');

dotenv.config();

// Unique image URLs from different categories
const uniqueImages = {
  modern: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560782496-c898f9fb8d37?w=800&h=600&fit=crop&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=800&h=600&fit=crop&q=80',
  ],
  minimalist: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523217311519-d595dc36ab0b?w=800&h=600&fit=crop&q=80',
  ],
  industrial: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587584622649-fb0be0d52364?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
  ],
  contemporary: [
    'https://images.unsplash.com/photo-1576941089067-2de3dd21bfb0?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&q=80',
  ],
  coastal: [
    'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740ff023?w=800&h=600&fit=crop&q=80',
  ],
  studio: [
    'https://images.unsplash.com/photo-1527482797697-8795b1a55a45?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560592494-0b4ab1145362?w=800&h=600&fit=crop&q=80',
  ],
  bedroom: [
    'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532372320572-cda4815dff92?w=800&h=600&fit=crop&q=80',
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop&q=80',
  ],
  living: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503672260-b0b2b5b54c54?w=800&h=600&fit=crop&q=80',
  ],
  bathroom: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop&q=80',
  ],
  exterior: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570129477492-45a003537e1b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&q=80',
  ]
};

const imageAssignments = [
  // Property 1: Cozy Studio
  ['modern', 'studio', 'minimalist', 'contemporary'],
  // Property 2: Luxury 2BHK
  ['luxury', 'bedroom', 'kitchen', 'living'],
  // Property 3: Modern Villa
  ['nature', 'exterior', 'contemporary', 'living'],
  // Property 4: 1BHK University
  ['studio', 'minimalist', 'contemporary', 'modern'],
  // Property 5: Penthouse
  ['luxury', 'industrial', 'contemporary', 'modern'],
  // Property 6: House Backyard
  ['nature', 'exterior', 'contemporary', 'living'],
  // Property 7: Condo
  ['minimalist', 'bedroom', 'kitchen', 'living'],
  // Property 8: Loft Arts
  ['industrial', 'contemporary', 'modern', 'luxury'],
  // Property 9: Beach View
  ['coastal', 'contemporary', 'living', 'bedroom'],
  // Property 10: Eco Apartment
  ['nature', 'modern', 'kitchen', 'living'],
  // Property 11: Serviced Apartment
  ['luxury', 'bedroom', 'living', 'kitchen'],
  // Property 12: Warehouse Loft
  ['industrial', 'contemporary', 'modern', 'luxury'],
  // Property 13: Family Villa
  ['nature', 'exterior', 'living', 'contemporary'],
  // Property 14: Smart Home
  ['modern', 'contemporary', 'kitchen', 'living'],
  // Property 15: Artist Studio
  ['studio', 'minimalist', 'contemporary', 'modern'],
  // Property 16: Boutique Hotel
  ['luxury', 'bedroom', 'living', 'contemporary']
];

async function updateWithUniqueImages() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const properties = await Property.find({}).sort('createdAt');
    console.log(`Found ${properties.length} properties`);

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i];
      const categoryKeys = imageAssignments[i] || ['modern', 'luxury', 'minimalist', 'contemporary'];

      // Get unique images from assigned categories
      const images = [];
      const usedUrls = new Set();

      for (let catKey of categoryKeys) {
        const categoryImages = uniqueImages[catKey] || uniqueImages.modern;
        for (let imgUrl of categoryImages) {
          if (!usedUrls.has(imgUrl)) {
            images.push({ url: imgUrl });
            usedUrls.add(imgUrl);
            break; // Take first unused from this category
          }
        }
      }

      // If we don't have 4 images, add more
      if (images.length < 4) {
        const allImages = Object.values(uniqueImages).flat();
        for (let imgUrl of allImages) {
          if (!usedUrls.has(imgUrl) && images.length < 4) {
            images.push({ url: imgUrl });
            usedUrls.add(imgUrl);
          }
        }
      }

      await Property.findByIdAndUpdate(prop._id, { images: images.slice(0, 4) });
      console.log(`✅ ${i + 1}. ${prop.title} - ${images.length} unique images`);
    }

    console.log(`\n✅ All properties updated with unique, diverse images!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateWithUniqueImages();
