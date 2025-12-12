package edu.utn.alojamiento.config

import edu.utn.alojamiento.security.JwtAuthenticationFilter
import edu.utn.alojamiento.security.OAuth2LoginSuccessHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(
	private val jwtAuthenticationFilter: JwtAuthenticationFilter,
	private val oAuth2LoginSuccessHandler: OAuth2LoginSuccessHandler
) {

	@Bean
	fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
		http
			.cors { }  // Use existing CORS configuration
			.csrf { it.disable() }  // Disable CSRF for demo (stateless JWT auth)
			.sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
			.authorizeHttpRequests { auth ->
				auth
					.requestMatchers("/oauth2/**", "/login/**").permitAll()  // OAuth2 endpoints
					.requestMatchers("/api/**").permitAll()  // All API endpoints permitted for demo
					.anyRequest().authenticated()
			}
			.oauth2Login { oauth2 ->
				oauth2.successHandler(oAuth2LoginSuccessHandler)
			}
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

		return http.build()
	}
}
