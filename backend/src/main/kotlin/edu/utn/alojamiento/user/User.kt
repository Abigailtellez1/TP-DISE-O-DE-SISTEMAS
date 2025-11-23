package edu.utn.alojamiento.user

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "users")
data class User(
	@Id
	@Column(length = 64)
	val id: String,
	@Column(nullable = false, unique = true)
	var email: String,
	@Column(nullable = false)
	var name: String,
	var preferredBedrooms: Int? = null
)
