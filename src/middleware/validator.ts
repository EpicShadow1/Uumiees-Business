import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//User registration validation
export const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be 8+ chars with uppercase, lowercase, number, and special char'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  handleValidationErrors
];

//Product validation
export const productValidation = [
    body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name required'),
    body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be positive'),
    body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be non-negative'),
    handleValidationErrors
];

// Order validation
export const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  handleValidationErrors
];

// Login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .notEmpty()
    .withMessage('Password required'),
  handleValidationErrors
];

