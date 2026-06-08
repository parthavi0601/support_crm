export interface Note {
  _id: string;
  noteText: string;
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
  notes: Note[];
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
