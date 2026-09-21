import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { supportTicketController } from '../controllers';

const router = Router();

// All routes require authentication
router.post('/', authenticate, supportTicketController.createTicket.bind(supportTicketController));
router.get('/my', authenticate, supportTicketController.getUserTickets.bind(supportTicketController));
router.get('/:id', authenticate, supportTicketController.getTicket.bind(supportTicketController));
router.get('/', authenticate, supportTicketController.getAllTickets.bind(supportTicketController));
router.put('/:id', authenticate, supportTicketController.updateTicket.bind(supportTicketController));
router.post('/:id/messages', authenticate, supportTicketController.addMessage.bind(supportTicketController));
router.delete('/:id', authenticate, supportTicketController.deleteTicket.bind(supportTicketController));

export default router;