import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { categoryController } from '../controllers';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories.bind(categoryController));
router.get('/tree', categoryController.getCategoryTree.bind(categoryController));
router.get('/:id', categoryController.getCategory.bind(categoryController));
router.get('/slug/:slug', categoryController.getCategoryBySlug.bind(categoryController));
router.get('/product/:productId', categoryController.getProductCategories.bind(categoryController));

// Protected routes (require authentication)
router.post('/', authenticate, categoryController.createCategory.bind(categoryController));
router.put('/:id', authenticate, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticate, categoryController.deleteCategory.bind(categoryController));
router.post('/assign', authenticate, categoryController.assignProductToCategory.bind(categoryController));
router.post('/remove', authenticate, categoryController.removeProductFromCategory.bind(categoryController));

export default router;