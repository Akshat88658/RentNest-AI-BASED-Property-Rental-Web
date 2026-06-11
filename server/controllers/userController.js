const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users (admin)
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, data: user });
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: user });
});

// @desc    Delete user (admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});
