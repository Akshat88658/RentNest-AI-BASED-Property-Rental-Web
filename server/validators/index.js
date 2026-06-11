const { body, param, query } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['tenant', 'landlord'])
    .withMessage('Role must be tenant or landlord'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.propertyValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('propertyType')
    .isIn(['apartment', 'house', 'villa', 'studio', 'condo', 'penthouse', 'other'])
    .withMessage('Invalid property type'),
  body('price.amount').isNumeric().withMessage('Price amount must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.pincode').notEmpty().withMessage('Pincode is required'),
];

exports.bookingValidator = [
  body('property').isMongoId().withMessage('Invalid property ID'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
];

exports.reviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
];

exports.mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
