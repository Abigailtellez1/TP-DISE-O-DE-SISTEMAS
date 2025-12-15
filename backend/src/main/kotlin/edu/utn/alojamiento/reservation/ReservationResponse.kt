package edu.utn.alojamiento.reservation

data class ReservationResponse(
	val id: Long,
	val listingId: Long,
	val listingTitle: String,
	val guestId: String,
	val guestName: String,
	val checkIn: String,
	val checkOut: String,
	val guests: Int
) {
	companion object {
		fun from(reservation: Reservation) = ReservationResponse(
			id = requireNotNull(reservation.id),
			listingId = requireNotNull(reservation.listing.id),
			listingTitle = reservation.listing.title,
			guestId = reservation.guest.id,
			guestName = reservation.guest.name,
			checkIn = reservation.checkIn,
			checkOut = reservation.checkOut,
			guests = reservation.guests
		)
	}
}
