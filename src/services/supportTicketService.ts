import { pool, executeWithRetry } from '../config/database';
import { SupportTicket, CreateSupportTicket, UpdateSupportTicket, TicketMessage, CreateTicketMessage } from '../models';

class SupportTicketService {
  async create(ticketData: CreateSupportTicket, userId: number): Promise<SupportTicket> {
    const { subject, description, category, priority } = ticketData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO support_tickets (user_id, subject, description, status, priority, category, created_at, updated_at)
         VALUES ($1, $2, $3, 'open', $4, $5, NOW(), NOW())
         RETURNING id, user_id, subject, description, status, priority, category, assigned_to, created_at, updated_at`,
        [userId, subject, description, priority || 'normal', category]
      );

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<SupportTicket | null> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT st.id, st.user_id, st.subject, st.description, st.status, st.priority, st.category, st.assigned_to, st.created_at, st.updated_at,
         u.name as user_name, u.email as user_email,
         a.name as assigned_to_name
         FROM support_tickets st
         LEFT JOIN users u ON st.user_id = u.id
         LEFT JOIN users a ON st.assigned_to = a.id
         WHERE st.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const ticket = result.rows[0];

      // Get messages
      const messagesResult = await pool.query(
        `SELECT tm.id, tm.ticket_id, tm.user_id, tm.message, tm.is_internal, tm.created_at,
         u.name as user_name
         FROM ticket_messages tm
         LEFT JOIN users u ON tm.user_id = u.id
         WHERE tm.ticket_id = $1 ORDER BY tm.created_at ASC`,
        [id]
      );

      return {
        ...ticket,
        user: {
          id: ticket.user_id,
          name: ticket.user_name,
          email: ticket.user_email
        },
        assigned_to_user: ticket.assigned_to ? {
          id: ticket.assigned_to,
          name: ticket.assigned_to_name
        } : null,
        messages: messagesResult.rows.map((msg: { id: number; ticket_id: number; user_id: number | null; message: string; is_internal: boolean; created_at: Date; user_name: string | null }) => ({
          ...msg,
          user: msg.user_id ? {
            id: msg.user_id,
            name: msg.user_name || ''
          } : null
        }))
      };
    });
  }

  async findByUserId(userId: number, limit = 10, offset = 0): Promise<SupportTicket[]> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `SELECT st.id, st.user_id, st.subject, st.description, st.status, st.priority, st.category, st.assigned_to, st.created_at, st.updated_at,
         u.name as user_name, u.email as user_email
         FROM support_tickets st
         LEFT JOIN users u ON st.user_id = u.id
         WHERE st.user_id = $1
         ORDER BY st.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );

      return result.rows.map((ticket: { id: number; user_id: number; subject: string; description: string; status: string; priority: string; category: string; assigned_to: number | null; created_at: Date; updated_at: Date; user_name: string; user_email: string }) => ({
        ...ticket,
        user: {
          id: ticket.user_id,
          name: ticket.user_name,
          email: ticket.user_email
        }
      }));
    });
  }

  async getAll(limit = 10, offset = 0, status?: string): Promise<SupportTicket[]> {
    return executeWithRetry(async () => {
      const query = status
        ? `SELECT st.id, st.user_id, st.subject, st.description, st.status, st.priority, st.category, st.assigned_to, st.created_at, st.updated_at,
           u.name as user_name, a.name as assigned_to_name
           FROM support_tickets st
           LEFT JOIN users u ON st.user_id = u.id
           LEFT JOIN users a ON st.assigned_to = a.id
           WHERE st.status = $1
           ORDER BY st.created_at DESC
           LIMIT $2 OFFSET $3`
        : `SELECT st.id, st.user_id, st.subject, st.description, st.status, st.priority, st.category, st.assigned_to, st.created_at, st.updated_at,
           u.name as user_name, u.email as user_email, a.name as assigned_to_name
           FROM support_tickets st
           LEFT JOIN users u ON st.user_id = u.id
           LEFT JOIN users a ON st.assigned_to = a.id
           ORDER BY st.created_at DESC
           LIMIT $1 OFFSET $2`;

      const params = status ? [status, limit, offset] : [limit, offset];
      const result = await pool.query(query, params);

      return result.rows.map((ticket: { id: number; user_id: number; subject: string; description: string; status: string; priority: string; category: string; assigned_to: number | null; created_at: Date; updated_at: Date; user_name: string; user_email: string; assigned_to_name: string | null }) => ({
        ...ticket,
        user: {
          id: ticket.user_id,
          name: ticket.user_name,
          email: ticket.user_email
        },
        assigned_to_user: ticket.assigned_to ? {
          id: ticket.assigned_to,
          name: ticket.assigned_to_name || ''
        } : null
      }));
    });
  }

  async update(id: number, ticketData: UpdateSupportTicket): Promise<SupportTicket | null> {
    const { status, priority, category, assigned_to } = ticketData;

    return executeWithRetry(async () => {
      const updates: string[] = [];
      const values: (string | number | null)[] = [];
      let paramCount = 1;

      if (status !== undefined) {
        updates.push(`status = $${paramCount}`);
        values.push(status);
        paramCount++;
      }

      if (priority !== undefined) {
        updates.push(`priority = $${paramCount}`);
        values.push(priority);
        paramCount++;
      }

      if (category !== undefined) {
        updates.push(`category = $${paramCount}`);
        values.push(category);
        paramCount++;
      }

      if (assigned_to !== undefined) {
        updates.push(`assigned_to = $${paramCount}`);
        values.push(assigned_to);
        paramCount++;
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      updates.push(`updated_at = NOW()`);

      const query = `
        UPDATE support_tickets
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, user_id, subject, description, status, priority, category, assigned_to, created_at, updated_at
      `;

      const result = await pool.query(query, values);
      return result.rows[0] || null;
    });
  }

  async addMessage(messageData: CreateTicketMessage, userId?: number): Promise<TicketMessage> {
    const { ticket_id, message, is_internal } = messageData;

    return executeWithRetry(async () => {
      const result = await pool.query(
        `INSERT INTO ticket_messages (ticket_id, user_id, message, is_internal, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, ticket_id, user_id, message, is_internal, created_at`,
        [ticket_id, userId, message, is_internal ?? false]
      );

      // Update ticket updated_at
      await pool.query(
        `UPDATE support_tickets SET updated_at = NOW() WHERE id = $1`,
        [ticket_id]
      );

      return result.rows[0];
    });
  }

  async delete(id: number): Promise<boolean> {
    return executeWithRetry(async () => {
      const result = await pool.query(
        `DELETE FROM support_tickets WHERE id = $1`,
        [id]
      );

      return (result.rowCount ?? 0) > 0;
    });
  }
}

export const supportTicketService = new SupportTicketService();