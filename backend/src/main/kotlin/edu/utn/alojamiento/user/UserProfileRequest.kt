package edu.utn.alojamiento.user

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class UserProfileRequest(
	@field:Email
	@field:NotBlank
	val email: String,
	@field:NotBlank
	@field:Size(min = 2, max = 100)
	val name: String,
	@field:Min(0)
	@field:Max(10)
	val preferredBedrooms: Int? = null
)
