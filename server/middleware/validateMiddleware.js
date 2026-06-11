const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results
 * Place after validator arrays in route chain
 */
exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(
      errors
        .array()
        .map((e) => e.msg)
        .join(', ')
    );
  }
  next();
};
