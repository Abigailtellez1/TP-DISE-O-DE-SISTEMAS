package edu.utn.alojamiento.user

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class LandlordProfileRequest(
	@field:Email
	@field:NotBlank
	val email: String,
	@field:NotBlank
	@field:Size(min = 2, max = 100)
	val name: String
)
