package edu.utn.alojamiento.reservation

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class ReservationRequest(
	@field:NotNull
	val listingId: Long,
	@field:NotBlank
	val guestId: String,
	@field:NotNull
	val checkIn: String,
	@field:NotNull
	val checkOut: String,
	@field:Min(1)
	val guests: Int
)
