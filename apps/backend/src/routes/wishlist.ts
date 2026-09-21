import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { wishlistController } from '../controllers';

const router = Router();

// All routes require authentication
router.post('/', authenticate, wishlistController.addToWishlist.bind(wishlistController));
router.delete('/product/:productId', authenticate, wishlistController.removeFromWishlist.bind(wishlistController));
router.get('/', authenticate, wishlistController.getUserWishlist.bind(wishlistController));
router.get('/product/:productId', authenticate, wishlistController.isInWishlist.bind(wishlistController));
router.delete('/', authenticate, wishlistController.clearWishlist.bind(wishlistController));

export default router;