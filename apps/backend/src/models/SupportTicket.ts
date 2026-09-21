import { SupportTicket as SharedSupportTicket, CreateSupportTicket as SharedCreateSupportTicket, UpdateSupportTicket as SharedUpdateSupportTicket, TicketMessage, CreateTicketMessage } from '@uumiees/types';

export type SupportTicket = SharedSupportTicket;
export type CreateSupportTicket = SharedCreateSupportTicket;
export type UpdateSupportTicket = SharedUpdateSupportTicket;
export { TicketMessage, CreateTicketMessage } from '@uumiees/types';