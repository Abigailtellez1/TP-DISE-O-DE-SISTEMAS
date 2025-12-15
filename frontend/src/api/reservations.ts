import { apiRequest } from './client'
import type { Reservation, ReservationRequest } from '../types/reservation'

export const createReservation = (payload: ReservationRequest) =>
  apiRequest<Reservation>('/api/reservations', {
    method: 'POST',
    body: payload,
  })
