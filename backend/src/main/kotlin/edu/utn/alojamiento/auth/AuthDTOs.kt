package edu.utn.alojamiento.auth

import edu.utn.alojamiento.user.UserType
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class RegistrationRequest(
	@field:NotBlank
	@field:Email
	val email: String,

	@field:NotBlank
	val name: String,

	val role: UserType,

	val preferredBedrooms: Int? = null
)

data class TokenResponse(
	val token: String
)
