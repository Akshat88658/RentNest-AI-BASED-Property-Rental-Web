const router = require('express').Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { reviewValidator, mongoIdValidator } = require('../validators');
const { handleValidation } = require('../middleware/validateMiddleware');

router.get('/', getReviews);
router.post('/:propertyId', protect, reviewValidator, handleValidation, addReview);
router.delete('/:id', protect, mongoIdValidator, handleValidation, deleteReview);

module.exports = router;
