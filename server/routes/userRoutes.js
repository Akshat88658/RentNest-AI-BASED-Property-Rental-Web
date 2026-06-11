const router = require('express').Router();
const { getUsers, getUser, updateProfile, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', protect, authorize('admin'), getUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
