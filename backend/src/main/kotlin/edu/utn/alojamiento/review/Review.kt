package edu.utn.alojamiento.review

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
import java.time.LocalDateTime

@Entity
@Table(name = "reviews")
data class Review(
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	val id: Long? = null,
	@Column(nullable = false)
	var rating: Int,
	@Column(nullable = false, length = 2000)
	var comment: String,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id", nullable = false)
	val listing: Listing,
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "author_id", nullable = false)
	val author: User,
	@Column(nullable = false)
	val createdAt: LocalDateTime = LocalDateTime.now()
)
