package edu.utn.alojamiento.listing

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.math.BigDecimal

data class ListingRequest(
	@field:NotBlank
	val title: String,
	@field:NotBlank
	@field:Size(max = 2000)
	val description: String,
	@field:DecimalMin(value = "0.0", inclusive = false)
	val nightlyPrice: BigDecimal,
	@field:Min(0)
	val bedrooms: Int,
	@field:NotBlank
	val city: String,
	@field:NotBlank
	val district: String,
	@field:NotBlank
	val ownerId: String,
	@field:Min(1)
	val maxGuests: Int
)
