const mongoose = require('mongoose');

const propertyVerificationSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    documentName: {
      type: String,
      required: [true, 'Please provide document name'],
      trim: true,
      maxlength: [100, 'Document name cannot exceed 100 characters'],
    },
    documentType: {
      type: String,
      enum: ['ownership-deed', 'lease-agreement', 'property-tax', 'utility-bill', 'registration-certificate', 'other'],
      default: 'other',
    },
    documentImage: {
      public_id: String,
      url: { type: String, required: true },
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    aiVerificationResult: {
      isValid: Boolean,
      confidence: Number, // 0-100
      issues: [String],
      summary: String,
      verifiedAt: Date,
    },
    rejectionReason: String,
    notes: String,
  },
  { timestamps: true }
);

// Index for faster queries
propertyVerificationSchema.index({ property: 1, owner: 1 });
propertyVerificationSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('PropertyVerification', propertyVerificationSchema);
