import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { productReviewController } from '../controllers';

const router = Router();

// Public routes
router.get('/product/:productId', productReviewController.getProductReviews.bind(productReviewController));
router.get('/product/:productId/average', productReviewController.getAverageRating.bind(productReviewController));
router.get('/:id', productReviewController.getReview.bind(productReviewController));

// Protected routes (require authentication)
router.post('/', authenticate, productReviewController.createReview.bind(productReviewController));
router.put('/:id', authenticate, productReviewController.updateReview.bind(productReviewController));
router.post('/:id/helpful', productReviewController.markReviewHelpful.bind(productReviewController));
router.delete('/:id', authenticate, productReviewController.deleteReview.bind(productReviewController));

export default router;