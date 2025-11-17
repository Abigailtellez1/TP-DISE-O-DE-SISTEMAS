package edu.utn.alojamiento.listing

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal

@Entity
@Table(name = "listings")
data class Listing(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long? = null,
	@Column(nullable = false)
	var title: String = "",
	@Column(nullable = false, length = 2000)
	var description: String = "",
	@Column(nullable = false)
	var nightlyPrice: BigDecimal = BigDecimal.ZERO,
	@Column(nullable = false)
	var city: String = "",
	@Column(nullable = false)
	var maxGuests: Int = 1
)
