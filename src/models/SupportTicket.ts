export interface SupportTicket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assigned_to: number | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  assigned_to_user?: {
    id: number;
    name: string;
  };
  messages?: TicketMessage[];
}

export interface CreateSupportTicket {
  subject: string;
  description: string;
  category?: string;
  priority?: string;
}

export interface UpdateSupportTicket {
  status?: string;
  priority?: string;
  category?: string;
  assigned_to?: number;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number | null;
  message: string;
  is_internal: boolean;
  created_at: Date;
  user?: {
    id: number;
    name: string;
  };
}

export interface CreateTicketMessage {
  ticket_id: number;
  message: string;
  is_internal?: boolean;
}