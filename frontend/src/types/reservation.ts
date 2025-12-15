export interface Reservation {
  id: number
  listingId: number
  guestId: string
  checkIn: string
  checkOut: string
  guests: number
  status?: string
}

export interface ReservationRequest {
  listingId: number
  guestId: string
  checkIn: string
  checkOut: string
  guests: number
}
