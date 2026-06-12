const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking request
// @route   POST /api/v1/bookings
// @access  Private/Tenant
exports.createBooking = asyncHandler(async (req, res) => {
  const { property: propertyId, startDate, endDate, message } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() === req.user.id) {
    res.status(400);
    throw new Error('You cannot book your own property');
  }

  const booking = await Booking.create({
    property: propertyId,
    tenant: req.user.id,
    owner: property.owner,
    startDate,
    endDate,
    rentAmount: property.price.amount,
    message,
  });

  res.status(201).json({ success: true, data: booking });
});

// @desc    Get bookings for current user (tenant or landlord)
// @route   GET /api/v1/bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === 'landlord'
      ? { owner: req.user.id }
      : { tenant: req.user.id };

  const bookings = await Booking.find(filter)
    .populate('property', 'title images location price')
    .populate('tenant', 'name email')
    .populate('owner', 'name email')
    .sort('-createdAt');

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Update booking status (approve / reject)
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Landlord
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  await booking.save();

  res.json({ success: true, data: booking });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (
    booking.tenant.toString() !== req.user.id &&
    booking.owner.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ success: true, data: booking });
});
