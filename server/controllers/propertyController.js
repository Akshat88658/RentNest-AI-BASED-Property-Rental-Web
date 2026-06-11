const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');

// @desc    Get all properties (with filters, search, pagination)
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { status: 'available' };

  if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i');
  if (req.query.type) filter.propertyType = req.query.type;
  if (req.query.furnished) filter['features.furnished'] = req.query.furnished;
  if (req.query.minPrice) filter['price.amount'] = { $gte: Number(req.query.minPrice) };
  if (req.query.maxPrice) {
    filter['price.amount'] = { ...filter['price.amount'], $lte: Number(req.query.maxPrice) };
  }
  if (req.query.bedrooms) filter['features.bedrooms'] = { $gte: Number(req.query.bedrooms) };

  // Search by title or description
  if (req.query.search) {
    filter.$or = [
      { title: new RegExp(req.query.search, 'i') },
      { description: new RegExp(req.query.search, 'i') },
    ];
  }

  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate('owner', 'name avatar')
    .sort(req.query.sort || '-createdAt')
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: properties.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'name email avatar phone')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user',
        select: 'name avatar',
      },
    });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  res.json({ success: true, data: property });
});

// @desc    Create property
// @route   POST /api/v1/properties
// @access  Private/Landlord
exports.createProperty = asyncHandler(async (req, res) => {
  req.body.owner = req.user.id;

  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private/Owner
exports.updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Verify ownership
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: property });
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private/Owner
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this property');
  }

  // Delete images from Cloudinary
  for (const image of property.images) {
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await property.deleteOne();
  res.json({ success: true, message: 'Property deleted' });
});

// @desc    Get properties owned by current user
// @route   GET /api/v1/properties/my-listings
// @access  Private/Landlord
exports.getMyListings = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user.id }).sort('-createdAt');
  res.json({ success: true, count: properties.length, data: properties });
});
