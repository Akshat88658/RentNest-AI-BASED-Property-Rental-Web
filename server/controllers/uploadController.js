const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const PropertyVerification = require('../models/PropertyVerification');
const Property = require('../models/Property');
const aiService = require('../services/aiService');

// @desc    Upload property images
// @route   POST /api/v1/upload/property-images
// @access  Private/Landlord
exports.uploadPropertyImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  const images = req.files.map((file) => ({
    public_id: file.filename,
    url: file.path,
  }));

  res.json({ success: true, count: images.length, data: images });
});

// @desc    Upload avatar
// @route   POST /api/v1/upload/avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image');
  }

  res.json({
    success: true,
    data: {
      public_id: req.file.filename,
      url: req.file.path,
    },
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/v1/upload/:publicId
// @access  Private
exports.deleteImage = asyncHandler(async (req, res) => {
  const result = await cloudinary.uploader.destroy(req.params.publicId);

  if (result.result !== 'ok') {
    res.status(400);
    throw new Error('Failed to delete image');
  }

  res.json({ success: true, message: 'Image deleted' });
});

// @desc    Upload property verification document
// @route   POST /api/v1/upload/property-verification/:propertyId
// @access  Private/Landlord
exports.uploadPropertyVerification = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { documentName } = req.body;

  // Verify property exists and user is owner
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to upload documents for this property');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a document image');
  }

  // Create verification document record
  const verification = await PropertyVerification.create({
    property: propertyId,
    owner: req.user._id,
    documentName,
    documentType: 'other',
    documentImage: {
      public_id: req.file.filename,
      url: req.file.path,
    },
    verificationStatus: 'pending',
  });

  // Trigger AI verification asynchronously (non-blocking)
  setImmediate(async () => {
    try {
      const aiResult = await aiService.verifyPropertyDocument(req.file.path, documentName);
      
      verification.aiVerificationResult = {
        isValid: aiResult.isValid,
        confidence: aiResult.confidence,
        issues: aiResult.issues || [],
        summary: aiResult.summary,
        verifiedAt: new Date(),
      };
      verification.verificationStatus = aiResult.isValid ? 'verified' : 'rejected';
      if (!aiResult.isValid) {
        verification.rejectionReason = aiResult.reason;
      }
      await verification.save();
    } catch (error) {
      console.error('AI verification error:', error);
      verification.verificationStatus = 'rejected';
      verification.rejectionReason = 'Failed to verify document. Please try again.';
      await verification.save();
    }
  });

  res.status(201).json({ success: true, data: verification });
});

// @desc    Get property verification documents
// @route   GET /api/v1/upload/property-verification/:propertyId
// @access  Private
exports.getPropertyVerifications = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const verifications = await PropertyVerification.find({ property: propertyId })
    .sort('-createdAt');

  res.json({ success: true, count: verifications.length, data: verifications });
});

// @desc    Delete property verification document
// @route   DELETE /api/v1/upload/property-verification/:verificationId
// @access  Private/Landlord
exports.deletePropertyVerification = asyncHandler(async (req, res) => {
  const { verificationId } = req.params;

  const verification = await PropertyVerification.findById(verificationId);
  if (!verification) {
    res.status(404);
    throw new Error('Verification document not found');
  }

  if (verification.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this document');
  }

  // Delete from Cloudinary
  if (verification.documentImage?.public_id) {
    await cloudinary.uploader.destroy(verification.documentImage.public_id);
  }

  await PropertyVerification.findByIdAndDelete(verificationId);

  res.json({ success: true, message: 'Document deleted' });
});
