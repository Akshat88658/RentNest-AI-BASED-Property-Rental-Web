const router = require('express').Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../validators');
const { handleValidation } = require('../middleware/validateMiddleware');

router.post('/register', registerValidator, handleValidation, register);
router.post('/login', loginValidator, handleValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
