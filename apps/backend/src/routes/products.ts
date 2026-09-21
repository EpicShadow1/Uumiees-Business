import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { productValidation } from '../middleware/validator';
import { productController } from '../controllers';

const router = Router();

// Public routes
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProduct.bind(productController));

// Protected routes (require authentication)
router.post('/', authenticate, productValidation, productController.createProduct.bind(productController));
router.put('/:id', authenticate, productController.updateProduct.bind(productController));
router.delete('/:id', authenticate, productController.deleteProduct.bind(productController));

// Stock management
router.post('/:id/stock', authenticate, productController.updateStock.bind(productController));
router.get('/:id/stock', productController.checkStock.bind(productController));

export default router;