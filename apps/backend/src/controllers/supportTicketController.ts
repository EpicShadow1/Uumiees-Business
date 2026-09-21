import { Request, Response } from 'express';
import { supportTicketService } from '../services';
import { getQueryParam, getPathParam } from '../utils/helpers';

class SupportTicketController {
  async createTicket(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const ticket = await supportTicketService.create(req.body, req.user.userId);
      res.status(201).json({
        message: 'Support ticket created successfully',
        ticket
      });
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create support ticket' });
    }
  }

  async getTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(getPathParam(req.params.id), 10);
      const ticket = await supportTicketService.findById(ticketId);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json(ticket);
    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({ error: 'Failed to fetch ticket' });
    }
  }

  async getUserTickets(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const limit = getQueryParam(req.query.limit, 10);
      const offset = getQueryParam(req.query.offset, 0);

      const tickets = await supportTicketService.findByUserId(req.user.userId, limit, offset);
      res.json(tickets);
    } catch (error) {
      console.error('Get user tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch user tickets' });
    }
  }

  async getAllTickets(req: Request, res: Response) {
    try {
      const limit = getQueryParam(req.query.limit, 10);
      const offset = getQueryParam(req.query.offset, 0);
      const status = req.query.status as string;

      const tickets = await supportTicketService.getAll(limit, offset, status);
      res.json(tickets);
    } catch (error) {
      console.error('Get all tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(getPathParam(req.params.id), 10);
      const ticket = await supportTicketService.update(ticketId, req.body);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({
        message: 'Ticket updated successfully',
        ticket
      });
    } catch (error) {
      console.error('Update ticket error:', error);
      res.status(500).json({ error: 'Failed to update ticket' });
    }
  }

  async addMessage(req: Request, res: Response) {
    try {
      const message = await supportTicketService.addMessage(req.body, req.user?.userId);
      res.status(201).json({
        message: 'Message added successfully',
        ticketMessage: message
      });
    } catch (error) {
      console.error('Add message error:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  }

  async deleteTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(getPathParam(req.params.id), 10);
      const success = await supportTicketService.delete(ticketId);

      if (!success) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      console.error('Delete ticket error:', error);
      res.status(500).json({ error: 'Failed to delete ticket' });
    }
  }
}

export const supportTicketController = new SupportTicketController();