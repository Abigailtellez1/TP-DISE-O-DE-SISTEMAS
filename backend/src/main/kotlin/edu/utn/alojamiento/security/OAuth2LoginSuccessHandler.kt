package edu.utn.alojamiento.security

import edu.utn.alojamiento.user.UserRepository
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.stereotype.Component
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Component
class OAuth2LoginSuccessHandler(
	private val userRepository: UserRepository,
	private val jwtService: JwtService
) : SimpleUrlAuthenticationSuccessHandler() {

	@Value("\${frontend.url:http://localhost:5173}")
	private lateinit var frontendUrl: String

	override fun onAuthenticationSuccess(
		request: HttpServletRequest,
		response: HttpServletResponse,
		authentication: Authentication
	) {
		val oAuth2User = authentication.principal as OAuth2User

		val email = oAuth2User.getAttribute<String>("email")
			?: throw IllegalStateException("Email not found in OAuth2 user")
		val name = oAuth2User.getAttribute<String>("name")
			?: throw IllegalStateException("Name not found in OAuth2 user")

		val existingUser = userRepository.findByEmail(email)

		if (existingUser != null) {
			// User exists - generate JWT and redirect to callback
			val token = jwtService.generateToken(
				userId = existingUser.id,
				email = existingUser.email,
				role = existingUser.type.name,
				name = existingUser.name
			)

			val redirectUrl = "$frontendUrl/auth/callback?token=${URLEncoder.encode(token, StandardCharsets.UTF_8)}"
			redirectStrategy.sendRedirect(request, response, redirectUrl)
		} else {
			// New user - redirect to registration page
			val redirectUrl = "$frontendUrl/auth/register" +
				"?email=${URLEncoder.encode(email, StandardCharsets.UTF_8)}" +
				"&name=${URLEncoder.encode(name, StandardCharsets.UTF_8)}"
			redirectStrategy.sendRedirect(request, response, redirectUrl)
		}
	}
}
