const asyncHandler = require('express-async-handler');
const aiService = require('../services/aiService');

// @desc    Generate AI property description
// @route   POST /api/v1/ai/generate-description
// @access  Private/Landlord
exports.generateDescription = asyncHandler(async (req, res) => {
  const { title, propertyType, features, location, amenities } = req.body;

  const description = await aiService.generatePropertyDescription({
    title,
    propertyType,
    features,
    location,
    amenities,
  });

  res.json({ success: true, data: { description } });
});

// @desc    AI-powered property recommendations
// @route   POST /api/v1/ai/recommendations
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  const recommendations = await aiService.getPropertyRecommendations(preferences);
  res.json({ success: true, data: recommendations });
});

// @desc    AI chatbot for tenant queries
// @route   POST /api/v1/ai/chat
// @access  Private
exports.chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;

  const reply = await aiService.chatWithAssistant(message, conversationHistory);
  res.json({ success: true, data: { reply } });
});

// @desc    AI-powered smart property search
// @route   POST /api/v1/ai/smart-search
// @access  Public
exports.smartSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query');
  }

  const filters = await aiService.parseSmartSearch(query);
  res.json({ success: true, data: filters });
});
