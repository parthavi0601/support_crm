import axios from 'axios';
import { TicketsResponse, Ticket, Activity, AnalyticsData } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const createTicket = (data: Partial<Ticket>) => api.post<{ ticketId: string }>('/tickets', data);

export const getAllTickets = (params?: { search?: string; status?: string; priority?: string; assignedTo?: string; page?: number; limit?: number; sort?: string }) => 
  api.get<TicketsResponse>('/tickets', { params });

export const getTicketById = (ticketId: string) => api.get<Ticket>(`/tickets/${ticketId}`);

export const updateTicket = (ticketId: string, data: Partial<Ticket> & { note?: string }) => 
  api.put<{ success: boolean }>(`/tickets/${ticketId}`, data);

export const getRecentActivity = () => api.get<Activity[]>('/tickets/activity');

export const getAnalytics = () => api.get<AnalyticsData>('/analytics');

export default api;
