package edu.utn.alojamiento.review

import java.time.LocalDateTime

data class ReviewResponse(
	val id: Long,
	val listingId: Long,
	val rating: Int,
	val comment: String,
	val authorId: String,
	val authorName: String,
	val createdAt: LocalDateTime
) {
	companion object {
		fun from(review: Review) = ReviewResponse(
			id = requireNotNull(review.id),
			listingId = requireNotNull(review.listing.id),
			rating = review.rating,
			comment = review.comment,
			authorId = review.author.id,
			authorName = review.author.name,
			createdAt = review.createdAt
		)
	}
}
