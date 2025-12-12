package edu.utn.alojamiento.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.*
import javax.crypto.SecretKey

@Service
class JwtService {

	@Value("\${jwt.secret}")
	private lateinit var secret: String

	@Value("\${jwt.expiration}")
	private var expiration: Long = 604800000 // 7 days default

	private fun getSigningKey(): SecretKey {
		return Keys.hmacShaKeyFor(secret.toByteArray())
	}

	fun generateToken(
		userId: String,
		email: String,
		role: String,
		name: String
	): String {
		val now = Date()
		val expiryDate = Date(now.time + expiration)

		return Jwts.builder()
			.subject(userId)
			.claim("email", email)
			.claim("role", role)
			.claim("name", name)
			.issuedAt(now)
			.expiration(expiryDate)
			.signWith(getSigningKey())
			.compact()
	}

	fun validateToken(token: String): Boolean {
		return try {
			Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
			true
		} catch (e: Exception) {
			false
		}
	}

	fun extractUserId(token: String): String {
		return extractClaims(token).subject
	}

	fun extractRole(token: String): String {
		return extractClaims(token)["role"] as String
	}

	fun extractEmail(token: String): String {
		return extractClaims(token)["email"] as String
	}

	fun extractName(token: String): String {
		return extractClaims(token)["name"] as String
	}

	private fun extractClaims(token: String): Claims {
		return Jwts.parser()
			.verifyWith(getSigningKey())
			.build()
			.parseSignedClaims(token)
			.payload
	}
}
