export interface Reservation {
  id: number
  listingId: number
  listingTitle: string
  guestId: string
  guestName: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface ReservationRequest {
  listingId: number
  guestId: string
  checkIn: string
  checkOut: string
  guests: number
}

export type ReservationUpdate = Partial<Omit<ReservationRequest, 'listingId' | 'guestId'>>

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
