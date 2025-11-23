package edu.utn.alojamiento.review

import edu.utn.alojamiento.listing.ListingNotFoundException
import edu.utn.alojamiento.listing.ListingRepository
import edu.utn.alojamiento.user.UserNotFoundException
import edu.utn.alojamiento.user.UserRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ReviewService(
	private val listingRepository: ListingRepository,
	private val userRepository: UserRepository,
	private val reviewRepository: ReviewRepository
) {

	@Transactional
	fun addReview(listingId: Long, request: ReviewRequest): ReviewResponse {
		val listing = listingRepository.findById(listingId)
			.orElseThrow { ListingNotFoundException(listingId) }
		val author = userRepository.findById(request.authorId)
			.orElseThrow { UserNotFoundException(request.authorId) }
		val review = reviewRepository.save(
			Review(
				rating = request.rating,
				comment = request.comment,
				listing = listing,
				author = author
			)
		)
		return ReviewResponse.from(review)
	}

	@Transactional(readOnly = true)
	fun getReviews(listingId: Long, pageable: Pageable): Page<ReviewResponse> {
		if (!listingRepository.existsById(listingId)) {
			throw ListingNotFoundException(listingId)
		}
		return reviewRepository.findByListingId(listingId, pageable)
			.map { ReviewResponse.from(it) }
	}
}
