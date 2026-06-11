const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: { type: Date, required: [true, 'Please provide start date'] },
    endDate: { type: Date, required: [true, 'Please provide end date'] },
    rentAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    message: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

// Prevent duplicate active bookings for same property + tenant
bookingSchema.index({ property: 1, tenant: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
