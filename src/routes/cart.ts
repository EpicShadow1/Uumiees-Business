import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { shoppingCartController } from '../controllers';

const router = Router();

// Public routes (guest carts supported via session ID)
router.get('/', shoppingCartController.getCart.bind(shoppingCartController));
router.post('/', shoppingCartController.addToCart.bind(shoppingCartController));
router.put('/items/:id', shoppingCartController.updateCartItem.bind(shoppingCartController));
router.delete('/items/:id', shoppingCartController.removeFromCart.bind(shoppingCartController));
router.delete('/', shoppingCartController.clearCart.bind(shoppingCartController));
router.get('/total', shoppingCartController.getCartTotal.bind(shoppingCartController));
router.get('/count', shoppingCartController.getCartItemCount.bind(shoppingCartController));
router.post('/merge', shoppingCartController.mergeCarts.bind(shoppingCartController));

export default router;