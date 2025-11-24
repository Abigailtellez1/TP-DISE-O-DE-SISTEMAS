package edu.utn.alojamiento.listing

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size
import java.math.BigDecimal

data class ListingUpdate(
	@field:Size(min = 1)
	val title: String? = null,
	@field:Size(min = 1, max = 2000)
	val description: String? = null,
	@field:DecimalMin(value = "0.0", inclusive = false)
	val nightlyPrice: BigDecimal? = null,
	@field:Min(0)
	val bedrooms: Int? = null,
	@field:Size(min = 1)
	val city: String? = null,
	@field:Size(min = 1)
	val district: String? = null,
	@field:Size(min = 1)
	val ownerId: String? = null,
	@field:Min(1)
	val maxGuests: Int? = null
)
