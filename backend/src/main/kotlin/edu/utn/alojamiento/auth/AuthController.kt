package edu.utn.alojamiento.auth

import edu.utn.alojamiento.security.JwtService
import edu.utn.alojamiento.user.UserService
import edu.utn.alojamiento.user.UserType
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
	private val userService: UserService,
	private val jwtService: JwtService
) {

	@PostMapping("/register")
	fun register(@Valid @RequestBody request: RegistrationRequest): TokenResponse {
		// Create user based on role
		val user = when (request.role) {
			UserType.STUDENT -> userService.upsertStudent(
				id = request.email,
				request = edu.utn.alojamiento.user.StudentProfileRequest(
					email = request.email,
					name = request.name,
					preferredBedrooms = request.preferredBedrooms
				)
			)
			UserType.LANDLORD -> userService.upsertLandlord(
				id = request.email,
				request = edu.utn.alojamiento.user.LandlordProfileRequest(
					email = request.email,
					name = request.name
				)
			)
		}

		// Generate JWT token
		val token = jwtService.generateToken(
			userId = user.id,
			email = user.email,
			role = user.type.name,
			name = user.name
		)

		return TokenResponse(token)
	}
}
