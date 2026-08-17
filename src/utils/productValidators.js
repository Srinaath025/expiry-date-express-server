const { body } = require('express-validator');

const productValidators = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    body('amount')
        .trim()
        .notEmpty()
        .withMessage('Amount is required')
        .isString()
        .withMessage('Amount must be a string'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['Pantry', 'Fridge', 'Freezer', 'Medicine', 'Beverages', 'Cleaning', 'Other'])
        .withMessage('Invalid category value'),
    body('expiryDate')
        .notEmpty()
        .withMessage('Expiry date is required')
        .isISO8601()
        .withMessage('Expiry date must be a valid ISO8601 date (YYYY-MM-DD)'),
    body('upc')
        .optional()
        .trim()
        .isString()
        .withMessage('UPC must be a string'),
];

module.exports = {
    productValidators,
};
