const router = require('express').Router();
const { generateDescription, getRecommendations, chat, smartSearch } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/generate-description', protect, authorize('landlord', 'admin'), generateDescription);
router.post('/recommendations', protect, getRecommendations);
router.post('/chat', protect, chat);
router.post('/smart-search', smartSearch); // Public route so anyone can search

module.exports = router;
