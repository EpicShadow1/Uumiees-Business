import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { userController } from '../controllers';

const router = Router();

// Public routes (for now - consider adding admin authentication later)
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));

// Protected routes
router.delete('/:id', authenticate, userController.deleteUser.bind(userController));

export default router;