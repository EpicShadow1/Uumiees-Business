import { Router } from 'express';
import { registerValidation, loginValidation } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';
import { userController } from '../controllers';

const router = Router();

// Registration endpoint
router.post('/register', authLimiter, registerValidation, userController.register.bind(userController));

// Login endpoint
router.post('/login', authLimiter, loginValidation, userController.login.bind(userController));

// Get current user profile/ Protected route
router.get('/me', authenticate, userController.getProfile.bind(userController));

// Update profile
router.put('/me', authenticate, userController.updateProfile.bind(userController));

export default router;