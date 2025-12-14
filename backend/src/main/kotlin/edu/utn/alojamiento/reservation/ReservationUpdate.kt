package edu.utn.alojamiento.reservation

import jakarta.validation.constraints.Future
import jakarta.validation.constraints.FutureOrPresent
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size
import java.time.LocalDate

data class ReservationUpdate(
	val listingId: Long? = null,
	@field:Size(min = 1)
	val guestId: String? = null,
	val checkIn: String? = null,
	val checkOut: String? = null,
	@field:Min(1)
	val guests: Int? = null
)
