import api from './axios';
import { ApiResponse, AuthResponse, EventResponse, ZoneResponse, SeatResponse, TicketResponse, QueueStatusResponse } from '../types';

// ========== AUTH ==========
export const authApi = {
  register: (data: { username: string; password: string; email: string; fullName?: string; phone?: string; dateOfBirth?: string; gender?: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  me: () => api.get<ApiResponse<AuthResponse>>('/auth/me'),
};

// ========== EVENTS (Public) ==========
export const eventApi = {
  list: () => api.get<ApiResponse<EventResponse[]>>('/events'),
  get: (id: number) => api.get<ApiResponse<EventResponse>>(`/events/${id}`),
  search: (q: string) => api.get<ApiResponse<EventResponse[]>>('/events/search', { params: { q } }),
  zones: (eventId: number) => api.get<ApiResponse<ZoneResponse[]>>(`/events/${eventId}/zones`),
  seats: (eventId: number) => api.get<ApiResponse<SeatResponse[]>>(`/events/${eventId}/seats`),
};

// ========== BOOKING ==========
export const bookingApi = {
  lockSeat: (seatId: number) => api.post<ApiResponse<TicketResponse>>(`/seats/${seatId}/lock`),
  confirmPayment: (ticketId: number) => api.post<ApiResponse<TicketResponse>>(`/tickets/${ticketId}/confirm`),
  cancelTicket: (ticketId: number) => api.delete<ApiResponse<void>>(`/tickets/${ticketId}`),
  myTickets: () => api.get<ApiResponse<TicketResponse[]>>('/tickets/my'),
  getTicket: (ticketId: number) => api.get<ApiResponse<TicketResponse>>(`/tickets/${ticketId}`),
};

// ========== QUEUE ==========
export const queueApi = {
  join: (eventId: number) => api.post<ApiResponse<QueueStatusResponse>>(`/queue/${eventId}/join`),
  status: (eventId: number) => api.get<ApiResponse<QueueStatusResponse>>(`/queue/${eventId}/status`),
  leave: (eventId: number) => api.delete<ApiResponse<void>>(`/queue/${eventId}/leave`),
};

// ========== ADMIN ==========
export const adminApi = {
  dashboard: () => api.get<ApiResponse<Record<string, any>>>('/admin/dashboard'),
  events: () => api.get<ApiResponse<EventResponse[]>>('/admin/events'),
  createEvent: (data: any) => api.post<ApiResponse<EventResponse>>('/admin/events', data),
  updateEvent: (id: number, data: any) => api.put<ApiResponse<EventResponse>>(`/admin/events/${id}`, data),
  updateStatus: (id: number, status: string) => api.put<ApiResponse<EventResponse>>(`/admin/events/${id}/status`, null, { params: { status } }),
  createZone: (eventId: number, data: any) => api.post<ApiResponse<ZoneResponse>>(`/admin/events/${eventId}/zones`, data),
  eventStats: (eventId: number) => api.get<ApiResponse<Record<string, any>>>(`/admin/events/${eventId}/stats`),
  demographics: (eventId: number) => api.get<ApiResponse<Record<string, any>>>(`/admin/events/${eventId}/demographics`),
};
