const router = require('express').Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { propertyValidator, mongoIdValidator } = require('../validators');
const { handleValidation } = require('../middleware/validateMiddleware');

router.get('/', getProperties);
router.get('/my-listings', protect, authorize('landlord', 'admin'), getMyListings);
router.get('/:id', mongoIdValidator, handleValidation, getProperty);
router.post('/', protect, authorize('landlord', 'admin'), propertyValidator, handleValidation, createProperty);
router.put('/:id', protect, mongoIdValidator, handleValidation, updateProperty);
router.delete('/:id', protect, mongoIdValidator, handleValidation, deleteProperty);

module.exports = router;
