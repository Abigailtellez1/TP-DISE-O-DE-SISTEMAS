package edu.utn.alojamiento.reservation

import edu.utn.alojamiento.listing.Listing
import edu.utn.alojamiento.user.User
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@Table(name = "reservations")
data class Reservation(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long? = null,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id", nullable = false)
	var listing: Listing,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "guest_id", nullable = false)
	var guest: User,
	@Column(nullable = false)
	var checkIn: String,
	@Column(nullable = false)
	var checkOut: String,
	@Column(nullable = false)
	var guests: Int
)
