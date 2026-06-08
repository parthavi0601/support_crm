export interface Note {
  _id: string;
  noteText: string;
  createdAt: string;
}

export interface Activity {
  _id: string;
  ticketId: string;
  actionType: 'TICKET_CREATED' | 'STATUS_CHANGED' | 'PRIORITY_CHANGED' | 'NOTE_ADDED' | 'ASSIGNMENT_CHANGED';
  description: string;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  notes: Note[];
  activities?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  Total: number;
  Open: number;
  'In Progress': number;
  Closed: number;
}

export interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

export interface TicketsResponse {
  tickets: Ticket[];
  stats: Stats;
  pagination: Pagination;
}

export interface AnalyticsData {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  criticalTickets: number;
  averageNotesPerTicket: number;
  statusDistribution: { name: string; value: number }[];
  priorityDistribution: { name: string; value: number }[];
  agentWorkload: { name: string; tickets: number }[];
  ticketCreationTrend: { date: string; tickets: number }[];
}
