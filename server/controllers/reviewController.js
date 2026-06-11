const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');

// @desc    Get reviews for a property
// @route   GET /api/v1/reviews?property=<id>
// @access  Public
exports.getReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.property) filter.property = req.query.property;

  const reviews = await Review.find(filter)
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc    Add review
// @route   POST /api/v1/reviews/:propertyId
// @access  Private/Tenant
exports.addReview = asyncHandler(async (req, res) => {
  req.body.property = req.params.propertyId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
});
