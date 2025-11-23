package edu.utn.alojamiento.notification

import java.time.LocalDateTime

data class ListingNotification(
	val listingId: Long,
	val listingTitle: String,
	val bedrooms: Int,
	val createdAt: LocalDateTime = LocalDateTime.now()
)
