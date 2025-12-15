import { apiRequest } from './client'
import type { Reservation, ReservationRequest, ReservationUpdate, Page } from '../types/reservation'

export interface ReservationQuery {
  guestId?: string
  listingId?: number
}

export const fetchReservations = (page = 0, size = 10, filters: ReservationQuery = {}) =>
  apiRequest<Page<Reservation>>('/api/reservations', { query: { page, size, ...filters } })

export const fetchReservation = (id: number) =>
  apiRequest<Reservation>(`/api/reservations/${id}`)

export const createReservation = (payload: ReservationRequest) =>
  apiRequest<Reservation>('/api/reservations', {
    method: 'POST',
    body: payload,
  })

export const updateReservation = (id: number, payload: ReservationUpdate) =>
  apiRequest<Reservation>(`/api/reservations/${id}`, {
    method: 'PATCH',
    body: payload,
  })

export const deleteReservation = (id: number) =>
  apiRequest<void>(`/api/reservations/${id}`, { method: 'DELETE' })
