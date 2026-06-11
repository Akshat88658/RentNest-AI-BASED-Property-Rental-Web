const router = require('express').Router();
const { uploadPropertyImages, uploadAvatar, deleteImage, uploadPropertyVerification, getPropertyVerifications, deletePropertyVerification } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadProperty, uploadAvatar: uploadAvatarMiddleware } = require('../middleware/uploadMiddleware');

router.post(
  '/property-images',
  protect,
  authorize('landlord', 'admin'),
  uploadProperty.array('images', 10),
  uploadPropertyImages
);
router.post('/avatar', protect, uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.post(
  '/property-verification/:propertyId',
  protect,
  authorize('landlord', 'admin'),
  uploadProperty.single('image'),
  uploadPropertyVerification
);
router.get('/property-verification/:propertyId', protect, getPropertyVerifications);
router.delete('/property-verification/:verificationId', protect, deletePropertyVerification);
router.delete('/:publicId', protect, deleteImage);

module.exports = router;
