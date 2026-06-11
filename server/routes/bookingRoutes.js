const router = require('express').Router();
const {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { bookingValidator } = require('../validators');
const { handleValidation } = require('../middleware/validateMiddleware');

router.post('/', protect, authorize('tenant'), bookingValidator, handleValidation, createBooking);
router.get('/', protect, getMyBookings);
router.put('/:id/status', protect, authorize('landlord', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
