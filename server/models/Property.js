const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a property title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'studio', 'condo', 'penthouse', 'other'],
      required: [true, 'Please specify property type'],
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance', 'unlisted'],
      default: 'available',
    },
    price: {
      amount: { type: Number, required: [true, 'Please provide rent amount'] },
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['monthly', 'yearly', 'daily'], default: 'monthly' },
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    features: {
      bedrooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      area: { type: Number }, // sq ft
      furnished: { type: String, enum: ['unfurnished', 'semi-furnished', 'fully-furnished'], default: 'unfurnished' },
      parking: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
    },
    amenities: [String],
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    bookingDetails: {
      minStay: { type: Number, default: 1 },
      maxStay: { type: Number, default: 365 },
      checkIn: { type: String, default: '2:00 PM' },
      checkOut: { type: String, default: '11:00 AM' },
      cancellationPolicy: { type: String, default: 'Flexible' },
      securityDeposit: { type: Number, default: 0 },
      extraCharges: { type: String, default: '' },
      houseRules: [String],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    aiDescription: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────
propertySchema.index({ 'location.city': 1, 'price.amount': 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ status: 1 });

// ── Generate slug before save ──────────────────
propertySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (typeof next === 'function') {
    next();
  }
});

// ── Virtual: reviews ───────────────────────────
propertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

module.exports = mongoose.model('Property', propertySchema);
